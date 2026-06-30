"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Lanyard from "@/components/Lanyard";
import Ticket from "@/components/Ticket";
import { BlossomColorPicker } from "@dayflow/blossom-color-picker-react";
import { PolaroidLink } from "@/components/Polaroid";
import { Github, type GithubProps } from "@/components/links/github";
import { Twitter } from "./links/twitter";
import { Discord, type DiscordProps } from "./links/discord";
import { Email } from "./links/email";
import { useLanyardWS } from "use-lanyard";

type Cell = { col: number; row: number };
type Dir = { dc: number; dr: number };
type BlossomColor = {
	hex: string;
	hue: number;
	saturation: number;
	alpha: number;
	layer: "outer" | "inner";
};

const SNAKE_INTERVAL = 130;

export default function Home({
	gh,
	dc,
}: {
	gh: GithubProps;
	dc: DiscordProps;
}) {
	const snowflake = "291050399509774340";
	const lanyard = useLanyardWS(snowflake);

	const [windowsWidth, setWindowsWidth] = useState(0);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setWindowsWidth(window.innerWidth);
		setMounted(true);
	}, []);

	const links: {
		href: string;
		label: string;
		ctx: React.ComponentType<any>;
		props: any;
	}[] = [
		{
			href: "/twitter",
			label: "Twitter",
			ctx: Twitter,
			props: null,
		},
		{
			href: "/discord",
			label: "Discord",
			ctx: Discord,
			props: { ...dc, ws: lanyard },
		},
		{
			href: "/github",
			label: "Github",
			ctx: Github,
			props: { ...gh },
		},
		{
			href: "mailto:hey@mattt.space",
			label: "Email",
			ctx: Email,
			props: null,
		},
	];

	const [lastUpdate, setUpdate] = useState<Date>(new Date("Dec 14 2024"));

	useEffect(() => {
		async function fetchPosts() {
			const res = await fetch("https://api.github.com/repos/punctuations/home");
			const data = await res.json();
			setUpdate(new Date(data.updated_at));
		}
		fetchPosts();
	}, []);

	// Snake state
	const [snakeActive, setSnakeActive] = useState(false);
	const [snakeCells, setSnakeCells] = useState<Set<string>>(new Set());
	const [foodCell, setFoodCell] = useState<string | null>(null);
	const [snakeScore, setSnakeScore] = useState(0);

	const [foodOverlapsReceipt, setFoodOverlapsReceipt] = useState(false);
	const [foodOverlapsTicket, setFoodOverlapsTicket] = useState<boolean[]>([]);
	const [foodOverlapsLinkPre, setFoodOverlapsLinkPre] = useState<boolean[]>([]);
	const [snakeOverlapsReceipt, setSnakeOverlapsReceipt] = useState(false);
	const [snakeOverlapsTicket, setSnakeOverlapsTicket] = useState<boolean[]>([]);
	const [snakeOverlapsLinkPre, setSnakeOverlapsLinkPre] = useState<boolean[]>(
		[],
	);
	const ticketRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const linkPreRefs = useRef<(HTMLDivElement | null)[]>([]);

	const mouseCellRef = useRef<Cell>({ col: 10, row: 7 });
	const snakeRef = useRef<Cell[]>([]);
	const dirRef = useRef<Dir>({ dc: 1, dr: 0 });
	const nextDirRef = useRef<Dir>({ dc: 1, dr: 0 });
	const foodRef = useRef<Cell | null>(null);
	const gridColsRef = useRef(0);
	const gridRowsRef = useRef(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const trailTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const [trailCells, setTrailCells] = useState<Set<string>>(new Set());
	const snakeScoreRef = useRef(0);

	// Grid dimensions
	useEffect(() => {
		function calcGrid() {
			const blockSize = window.innerWidth * 0.05;
			gridColsRef.current = 20;
			gridRowsRef.current = Math.ceil(window.innerHeight / blockSize);
		}
		calcGrid();
		window.addEventListener("resize", calcGrid);
		return () => window.removeEventListener("resize", calcGrid);
	}, []);

	// Track mouse cell position
	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			const blockSize = window.innerWidth * 0.05;
			const col = Math.floor(e.clientX / blockSize);
			const row = Math.floor(e.clientY / blockSize);
			mouseCellRef.current = {
				col: Math.max(0, Math.min(col, gridColsRef.current - 1)),
				row: Math.max(0, Math.min(row, gridRowsRef.current - 1)),
			};
		}
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const cellKey = (c: number, r: number) => `${c},${r}`;

	const placeFood = useCallback((occupied: Set<string>) => {
		const cols = gridColsRef.current;
		const rows = gridRowsRef.current;
		let fc: number, fr: number;
		do {
			fc = Math.floor(Math.random() * cols);
			fr = Math.floor(Math.random() * rows);
		} while (occupied.has(cellKey(fc, fr)));
		foodRef.current = { col: fc, row: fr };
		setFoodCell(cellKey(fc, fr));

		const blockSize = window.innerWidth * 0.05;
		const foodLeft = fc * blockSize;
		const foodTop = fr * blockSize;
		const foodRight = foodLeft + blockSize;
		const foodBottom = foodTop + blockSize;

		const overlaps = (el: HTMLElement | null) => {
			if (!el) return false;
			const r = el.getBoundingClientRect();
			const ix = Math.max(
				0,
				Math.min(foodRight, r.right) - Math.max(foodLeft, r.left),
			);
			const iy = Math.max(
				0,
				Math.min(foodBottom, r.bottom) - Math.max(foodTop, r.top),
			);
			return (ix * iy) / (blockSize * blockSize) >= 0.5;
		};

		setFoodOverlapsReceipt(overlaps(recieptRef.current));
		setFoodOverlapsTicket(ticketRefs.current.map(overlaps));
		setFoodOverlapsLinkPre(linkPreRefs.current.map(overlaps));
	}, []);

	const startSnake = useCallback(
		(initialDir: Dir) => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			trailTimers.current.forEach(clearTimeout);
			trailTimers.current = [];

			const cols = gridColsRef.current || 20;
			const rows = gridRowsRef.current || 15;

			// Start at the current mouse cell, falling back to center
			const mc = mouseCellRef.current;
			const sc = Math.max(0, Math.min(mc.col, cols - 1));
			const sr = Math.max(0, Math.min(mc.row, rows - 1));

			// Build the initial tail opposite to the intended direction so the snake
			// doesn't immediately overlap itself.
			const initial: Cell[] = [
				{ col: sc, row: sr },
				{ col: sc - initialDir.dc, row: sr - initialDir.dr },
				{ col: sc - initialDir.dc * 2, row: sr - initialDir.dr * 2 },
			].map((c) => ({
				col: Math.max(0, Math.min(c.col, cols - 1)),
				row: Math.max(0, Math.min(c.row, rows - 1)),
			}));

			snakeRef.current = initial;
			dirRef.current = initialDir;
			nextDirRef.current = initialDir;
			snakeScoreRef.current = 0;
			setSnakeScore(0);
			setTrailCells(new Set());

			const occupied = new Set(initial.map((s) => cellKey(s.col, s.row)));
			placeFood(occupied);

			setSnakeCells(new Set(initial.map((s) => cellKey(s.col, s.row))));
			setSnakeActive(true);

			intervalRef.current = setInterval(() => {
				const dir = nextDirRef.current;
				dirRef.current = dir;
				const head = snakeRef.current[0];
				const nc = head.col + dir.dc;
				const nr = head.row + dir.dr;

				if (
					nc < 0 ||
					nc >= gridColsRef.current ||
					nr < 0 ||
					nr >= gridRowsRef.current
				) {
					clearInterval(intervalRef.current!);
					setSnakeActive(false);
					setSnakeCells(new Set());
					setFoodCell(null);
					setTrailCells(new Set());
					setFoodOverlapsReceipt(false);
					setFoodOverlapsTicket([]);
					setFoodOverlapsLinkPre([]);
					setSnakeOverlapsReceipt(false);
					setSnakeOverlapsTicket([]);
					setSnakeOverlapsLinkPre([]);
					return;
				}

				if (snakeRef.current.some((s) => s.col === nc && s.row === nr)) {
					clearInterval(intervalRef.current!);
					setSnakeActive(false);
					setSnakeCells(new Set());
					setFoodCell(null);
					setTrailCells(new Set());
					setFoodOverlapsReceipt(false);
					setFoodOverlapsTicket([]);
					setFoodOverlapsLinkPre([]);
					setSnakeOverlapsReceipt(false);
					setSnakeOverlapsTicket([]);
					setSnakeOverlapsLinkPre([]);
					return;
				}

				const newHead: Cell = { col: nc, row: nr };
				const food = foodRef.current;
				const ate = food && nc === food.col && nr === food.row;

				const newSnake = [newHead, ...snakeRef.current];
				let tail: Cell | undefined;
				if (!ate) {
					tail = newSnake.pop();
				} else {
					snakeScoreRef.current += 1;
					setSnakeScore(snakeScoreRef.current);
					const occ = new Set(newSnake.map((s) => cellKey(s.col, s.row)));
					placeFood(occ);
				}

				snakeRef.current = newSnake;
				setSnakeCells(new Set(newSnake.map((s) => cellKey(s.col, s.row))));

				const bsz = window.innerWidth * 0.05;
				const snakeOverlap = (el: HTMLElement | null) => {
					if (!el) return false;
					const er = el.getBoundingClientRect();
					return newSnake.some((s) => {
						const sl = s.col * bsz,
							st = s.row * bsz;
						const sr2 = sl + bsz,
							sb = st + bsz;
						const ix = Math.max(
							0,
							Math.min(sr2, er.right) - Math.max(sl, er.left),
						);
						const iy = Math.max(
							0,
							Math.min(sb, er.bottom) - Math.max(st, er.top),
						);
						return (ix * iy) / (bsz * bsz) >= 0.5;
					});
				};
				setSnakeOverlapsReceipt(snakeOverlap(recieptRef.current));
				setSnakeOverlapsTicket(ticketRefs.current.map(snakeOverlap));
				setSnakeOverlapsLinkPre(linkPreRefs.current.map(snakeOverlap));

				if (tail) {
					const tk = cellKey(tail.col, tail.row);
					setTrailCells((prev) => new Set(prev).add(tk));
					const t = setTimeout(() => {
						setTrailCells((prev) => {
							const next = new Set(prev);
							next.delete(tk);
							return next;
						});
					}, 400);
					trailTimers.current.push(t);
				}
			}, SNAKE_INTERVAL);
		},
		[placeFood],
	);

	// Arrow key listener
	useEffect(() => {
		const DIRS: Record<string, Dir> = {
			ArrowUp: { dc: 0, dr: -1 },
			w: { dc: 0, dr: -1 },
			ArrowDown: { dc: 0, dr: 1 },
			s: { dc: 0, dr: 1 },
			ArrowLeft: { dc: -1, dr: 0 },
			a: { dc: -1, dr: 0 },
			ArrowRight: { dc: 1, dr: 0 },
			d: { dc: 1, dr: 0 },
		};

		function handleKey(e: KeyboardEvent) {
			const d = DIRS[e.key];
			if (!d) return;
			e.preventDefault();

			if (!snakeActive) {
				startSnake(d);
				return;
			}

			const cur = dirRef.current;
			if (d.dc === -cur.dc && d.dr === -cur.dr) return;
			nextDirRef.current = d;
		}

		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [snakeActive, startSnake]);

	// Drawing
	const colorize = (el: any) => {
		el.style.backgroundColor = "white";
		setTimeout(() => {
			el.style.backgroundColor = "transparent";
		}, 300);
	};

	useEffect(() => {
		const randomRotation = Math.random() * (12 - 6) + 6;
		setRotation(Math.random() > 0.5 ? randomRotation : -randomRotation);
	}, []);

	const [rotation, setRotation] = useState(0);

	const [pickerPos, setPickerPos] = useState<{
		top: number;
		left: number;
	} | null>(null);

	const calcPickerPos = useCallback(() => {
		const el = recieptRef.current;
		if (!el) return;
		const hw = el.offsetWidth / 2;
		const hh = el.offsetHeight / 2;
		const r = el.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;
		const rad = (rotation * Math.PI) / 180;
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		const tlx = cx + (-hw * cos - -hh * sin);
		const tly = cy + (-hw * sin + -hh * cos);
		setPickerPos({ top: tly - 12, left: tlx - 12 });
	}, [rotation]);

	useEffect(() => {
		const t = setTimeout(calcPickerPos, 420);
		window.addEventListener("resize", calcPickerPos);
		return () => {
			clearTimeout(t);
			window.removeEventListener("resize", calcPickerPos);
		};
	}, [calcPickerPos]);

	// Imperatively manage an eraser circle div directly on document.body
	// so no React ancestor transform or overflow can ever clip it
	const eraserDivRef = useRef<HTMLDivElement | null>(null);

	const [drawing, setDrawing] = useState(false);
	const [erasing, setErasing] = useState(false);
	const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [lines, setLines] = useState<{ x: number; y: number }[][]>([]);
	const [colors, setColors] = useState<string[]>([]);
	const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>(
		[],
	);
	const svgRef = useRef<SVGSVGElement>(null);
	const recieptRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			if (!erasing) return;
			setEraserPos({ x: e.clientX, y: e.clientY });
			if (eraserDivRef.current) {
				eraserDivRef.current.style.left = `${e.clientX - 10}px`;
				eraserDivRef.current.style.top = `${e.clientY - 10}px`;
			}
		}
		function handleMouseUp() {
			if (!erasing) return;
			setErasing(false);
			setEraserPos(null);
		}
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [erasing]);

	useEffect(() => {
		if (!mounted) return;
		if (erasing) {
			const div = document.createElement("div");
			div.id = "eraser-circle";
			Object.assign(div.style, {
				position: "fixed",
				width: "20px",
				height: "20px",
				borderRadius: "50%",
				border: "1.5px dashed rgba(0,0,0,1)",
				backgroundColor: "rgba(0,0,0,0.1)",
				pointerEvents: "none",
				zIndex: "99999",
				top: "-100px",
				left: "-100px",
			});
			document.body.appendChild(div);
			eraserDivRef.current = div;
			return () => {
				div.remove();
				eraserDivRef.current = null;
			};
		}
	}, [erasing, mounted]);

	// Color state
	const [color, setColor] = useState<BlossomColor>({
		hex: "#ff0000",
		hue: 0,
		saturation: 70,
		alpha: 50,
		layer: "outer",
	});

	const getCoordinates = (
		e: React.MouseEvent<SVGSVGElement | HTMLDivElement>,
	): { x: number; y: number } => {
		const el = recieptRef.current;
		if (!el) return { x: 0, y: 0 };

		const rect = el.getBoundingClientRect();

		// un-rotate the mouse position back into the receipt's local space
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		const rad = (-rotation * Math.PI) / 180;

		return {
			x: dx * Math.cos(rad) - dy * Math.sin(rad) + el.offsetWidth / 2,
			y: dx * Math.sin(rad) + dy * Math.cos(rad) + el.offsetHeight / 2,
		};
	};

	// Erase parts of strokes within the eraser radius, splitting them into
	// separate sub-strokes either side of the erased segment.
	const eraseAt = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
		const { x, y } = getCoordinates(e);
		const RADIUS = 10;
		setLines((prev) => {
			const nextLines: { x: number; y: number }[][] = [];
			const nextColors: string[] = [];
			prev.forEach((line, i) => {
				let current: { x: number; y: number }[] = [];
				line.forEach((p) => {
					if (Math.hypot(p.x - x, p.y - y) < RADIUS) {
						if (current.length > 1) {
							nextLines.push(current);
							nextColors.push(colors[i]);
						}
						current = [];
					} else {
						current.push(p);
					}
				});
				if (current.length > 1) {
					nextLines.push(current);
					nextColors.push(colors[i]);
				}
			});
			setColors(nextColors);
			return nextLines;
		});
	};

	const startDrawing = (
		e: React.MouseEvent<SVGSVGElement | HTMLDivElement>,
	) => {
		if (e.button === 2) {
			e.preventDefault();
			setErasing(true);
			setEraserPos({ x: e.clientX, y: e.clientY });
			eraseAt(e);
		} else {
			setDrawing(true);
			setCurrentLine([getCoordinates(e)]);
		}
	};

	const draw = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
		if (erasing) {
			setEraserPos({ x: e.clientX, y: e.clientY });
			eraseAt(e);
			return;
		}
		if (!drawing) return;
		setCurrentLine((prev) => [...prev, getCoordinates(e)]);
	};

	const endDrawing = () => {
		if (erasing) {
			setErasing(false);
			setEraserPos(null);
			return;
		}
		if (drawing) {
			setLines((prev) => [...prev, currentLine]);
			setColors((prev) => [...prev, color.hex]);
			setCurrentLine([]);
			setDrawing(false);
		}
	};

	// Projects
	const projects = [
		{
			name: "use listen along",
			color: "#800020",
			link: "https://github.com/punctuations/use-listen-along",
			desc: "react hook for discord's listen along",
			date: "August 17, 2021",
			number: "0001",
		},
		{
			name: "oscilloscope",
			color: "#4F6A43",
			link: "https://github.com/punctuations/oscilloscope",
			desc: "a video/image converter to audio waveform",
			date: "Janurary 29, 2023",
			number: "0002",
		},
		{
			name: "jtp",
			color: "#3B4C5C",

			link: "https://github.com/punctuations/jtp",
			desc: "a high-performance binary protocol for images",
			date: "January 24, 2026",
			number: "0003",
		},
		{
			name: "fossil",
			color: "#9E7B3A",
			link: "https://github.com/punctuations/fossil",
			desc: "a compressor that shows its work",
			date: "June 27, 2026",
			number: "0004",
		},
	];

	const [random, setRandom] = useState<number[]>([]);
	const [ticketsEntered, setTicketsEntered] = useState<boolean[]>([]);
	useEffect(() => {
		setRandom([...Array(projects.length).keys()].map(() => Math.random()));
	}, []);

	const positions = [
		{ top: "4%", right: "15%" },
		{ top: "16%", right: "17%" },
		{ bottom: "13%", right: "27%" },
		{ bottom: "2%", right: "25%" },
	];

	return (
		<main className="absolute w-full h-full flex items-center justify-center flex-col-reverse md:flex-row md:space-x-24 space-x-0 space-y-16 md:space-y-0 mt-6 sm:mt-0">
			{mounted &&
				pickerPos &&
				createPortal(
					<motion.div
						key="blossom-picker"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							duration: 0.35,
							delay: 0.45,
							ease: [0.48, 0.15, 0.25, 0.96],
						}}
						className="hidden md:block w-8 h-8"
						style={{
							position: "fixed",
							top: pickerPos.top,
							left: pickerPos.left,
							zIndex: 50,
							opacity: foodOverlapsReceipt || snakeOverlapsReceipt ? 0.25 : 1,
							transition: "opacity 0.1s ease",
						}}
					>
						<div
							className="w-10 h-10 rounded-full pointer-events-none -top-1 -left-1 bcp-ring"
							style={{
								position: "absolute",
								backgroundColor: color.hex,
								opacity:
									foodOverlapsReceipt || snakeOverlapsReceipt ? 0.05 : 0.25,
								zIndex: -1,
							}}
						/>
						<span
							className="relative"
							style={{
								opacity: foodOverlapsReceipt || snakeOverlapsReceipt ? 0.25 : 1,
								transition: "opacity 0.1s ease",
							}}
						>
							<BlossomColorPicker
								value={color}
								onChange={(c) => setColor(c)}
								sliderPosition="left"
							/>
						</span>
					</motion.div>,
					document.body,
				)}

			{/* Snake score badge */}
			{snakeActive && (
				<div
					style={{
						position: "fixed",
						top: 12,
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 100,
						fontFamily: "monospace",
						fontSize: 12,
						letterSpacing: "0.2em",
						color: "rgba(255,255,255,0.5)",
						pointerEvents: "none",
					}}
				>
					score {snakeScore}
				</div>
			)}

			{/* Press arrow to play hint */}
			{!snakeActive && (
				<div
					style={{
						position: "fixed",
						bottom: 20,
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 100,
						fontFamily: "monospace",
						fontSize: 11,
						letterSpacing: "0.2em",
						color: "rgba(255,255,255,0.18)",
						pointerEvents: "none",
					}}
				>
					<span
						style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
					>
						<span className="kbd-cluster">
							<kbd className="kbd-key">↑</kbd>
							<span className="kbd-row">
								<kbd className="kbd-key">←</kbd>
								<kbd className="kbd-key">↓</kbd>
								<kbd className="kbd-key">→</kbd>
							</span>
						</span>
						<span
							style={{
								fontSize: 16,
								color: "rgba(255,255,255,0.18)",
								lineHeight: 1,
							}}
						>
							/
						</span>
						<span className="kbd-cluster">
							<kbd className="kbd-key">W</kbd>
							<span className="kbd-row">
								<kbd className="kbd-key">A</kbd>
								<kbd className="kbd-key">S</kbd>
								<kbd className="kbd-key">D</kbd>
							</span>
						</span>
						<span
							style={{
								fontSize: 11,
								color: "rgba(255,255,255,0.18)",
								letterSpacing: "0.2em",
							}}
						>
							<span className="ml-1">to play snake</span>
						</span>
					</span>
				</div>
			)}

			{/* Background grid */}
			<div className="bgrid select-none" style={{ marginLeft: 0 }}>
				{windowsWidth > 0 &&
					[...Array(20).keys()].map((_, colIndex) => (
						<div key={"b_" + colIndex} className="bcolumn">
							{(() => {
								const blockSize = windowsWidth * 0.05;
								const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
								return [...Array(nbOfBlocks).keys()].map((_, rowIndex) => {
									const k = cellKey(colIndex, rowIndex);
									const isHead =
										snakeActive &&
										snakeRef.current[0] &&
										snakeRef.current[0].col === colIndex &&
										snakeRef.current[0].row === rowIndex;
									const isBody = snakeCells.has(k) && !isHead;
									const isFood = foodCell === k;
									const isTrail = trailCells.has(k);
									let bg = "transparent";
									if (isHead) bg = "rgba(255,255,255,1)";
									else if (isBody) bg = "rgba(255,255,255,0.85)";
									else if (isFood) bg = "rgba(255,90,90,0.7)";
									else if (isTrail) bg = "rgba(255,255,255,0.07)";
									return (
										<div
											key={rowIndex}
											style={{
												backgroundColor: bg,
												transition: isTrail
													? "background-color 0.4s ease"
													: "none",
											}}
											onMouseEnter={(e) => {
												if (!snakeActive) colorize(e.target);
											}}
										/>
									);
								});
							})()}
						</div>
					))}
			</div>

			<section
				style={{
					transformOrigin: "center",
					opacity: foodOverlapsReceipt || snakeOverlapsReceipt ? 0.25 : 1,
					transition: "opacity 0.2s ease",
				}}
				className="relative min-w-64 max-w-72 w-3/6 sm:w-1/3 md:w-auto"
			>
				<svg
					ref={svgRef}
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={endDrawing}
					style={{
						zIndex: 20,
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						transform: `rotate(${rotation}deg)`,
						transformOrigin: "center center",
						pointerEvents: "none",
						cursor: "crosshair",
					}}
				>
					<defs>
						<clipPath id="recieptClip">
							<rect
								x={0}
								y={0}
								width={recieptRef.current?.offsetWidth ?? 0}
								height={recieptRef.current?.offsetHeight ?? 0}
							/>
						</clipPath>
					</defs>
					<g clipPath="url(#recieptClip)">
						{lines.map((line, index) => (
							<polyline
								key={index}
								points={line.map((p) => `${p.x},${p.y}`).join(" ")}
								fill="none"
								stroke={colors[index]}
								strokeWidth="2"
							/>
						))}
						<polyline
							points={currentLine.map((p) => `${p.x},${p.y}`).join(" ")}
							fill="none"
							stroke={color.hex}
							strokeWidth="2"
						/>
					</g>
				</svg>

				<motion.div
					initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
					animate={{ opacity: 1, scale: 1, rotate: rotation }}
					transition={{
						duration: 0.4,
						delay: 0,
						ease: [0.48, 0.15, 0.25, 0.96],
					}}
					onAnimationComplete={() => {
						const el = recieptRef.current;
						if (!el) return;
						const hw = el.offsetWidth / 2;
						const hh = el.offsetHeight / 2;
						const r = el.getBoundingClientRect();
						const cx = r.left + r.width / 2;
						const cy = r.top + r.height / 2;
						const rad = (rotation * Math.PI) / 180;
						const cos = Math.cos(rad);
						const sin = Math.sin(rad);
						const tlx = cx + (-hw * cos - -hh * sin);
						const tly = cy + (-hw * sin + -hh * cos);
						setPickerPos({ top: tly - 12, left: tlx - 12 });
					}}
					ref={recieptRef}
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={endDrawing}
					onMouseLeave={endDrawing}
					onContextMenu={(e) => e.preventDefault()}
					className="relative select-none reciept text-black rounded-sm px-6 py-4"
					style={{ cursor: erasing ? "none" : "crosshair" }}
				>
					<header>
						<div className="flex flex-row justify-between items-center">
							<h3 className="text-2xl">About me</h3>
							<h3>(matt)</h3>
						</div>
						<hr />
						<div className="flex flex-row justify-between items-center">
							<h3>Last Update: </h3>
							<h3>
								{lastUpdate.toLocaleString("de-CH", {
									dateStyle: "medium",
									timeStyle: "short",
									hour12: false,
								})}
							</h3>
						</div>
					</header>
					<div className="flex items-center justify-center">
						<img
							alt="hero image"
							className="h-60 pointer-events-none"
							src="/matt.png"
						/>
					</div>
					<hr className="!border-solid" />
					<div className="flex flex-row justify-between items-center text-lg">
						<p>location</p>
						<p>vancouver</p>
					</div>
					<div className="flex flex-row justify-between items-center text-lg">
						<p>timezone</p>
						<a
							className="cursor-pointer underline"
							title="pacific time"
							href="https://24timezones.com/time-zone/pt"
							target="_blank"
							rel="noopener noreferrer"
						>
							PT
						</a>
					</div>

					<fieldset className="pb-2 mt-2">
						<legend>
							<h6 className="text-lg">Get in touch</h6>
						</legend>
						<div
							id="socials"
							className="flex flex-row justify-between items-center space-x-2 md:space-x-0 text-lg"
						>
							{links.map((link, index) => (
								<PolaroidLink
									key={index}
									overlap={
										foodOverlapsLinkPre[index] || snakeOverlapsLinkPre[index]
									}
									parentOverlap={foodOverlapsReceipt || snakeOverlapsReceipt}
									href={link.href}
									label={link.label}
									rot={rotation}
									ref={(el) => {
										linkPreRefs.current[index] = el;
									}}
								>
									{link.ctx &&
										(link.props ? <link.ctx {...link.props} /> : <link.ctx />)}
								</PolaroidLink>
							))}
						</div>
					</fieldset>

					<footer className="mt-14 flex flex-col items-center justify-center text-lg">
						<motion.svg
							width="100%"
							height="100%"
							style={{
								zIndex: 20,
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								pointerEvents: "none",
							}}
							initial="hidden"
							animate="visible"
						>
							<motion.polyline
								points="57.90625,478 57.90625,478 58.90625,478 59.90625,477 61.90625,475 64.90625,474 68.90625,472 75.90625,470 83.90625,469 89.90625,469 93.90625,468 96.90625,468 99.90625,468 101.90625,469 103.90625,470 104.90625,472 104.90625,473 104.90625,475 104.90625,478 102.90625,482 99.90625,487 94.90625,493 89.90625,498 83.90625,503 78.90625,508 71.90625,512 65.90625,516 59.90625,519 56.90625,520 52.90625,521 50.90625,521 49.90625,521 49.90625,520 49.90625,519 50.90625,517 53.90625,513 57.90625,510 61.90625,507 66.90625,504 71.90625,501 78.90625,498 83.90625,496 88.90625,495 93.90625,493 97.90625,493 100.90625,492 102.90625,492 103.90625,492 104.90625,492 104.90625,493 103.90625,493 103.90625,494 102.90625,494 103.90625,494 105.90625,493 109.90625,492 113.90625,492 118.90625,491 123.90625,491 128.90625,490 133.90625,490 139.90625,490 144.90625,490 151.90625,491 157.90625,492 162.90625,492 167.90625,493 172.90625,494 176.90625,495 180.90625,495 182.90625,495 183.90625,495 184.90625,495 183.90625,495 182.90625,495 180.90625,495 178.90625,494 174.90625,493 170.90625,492 166.90625,490 161.90625,489 158.90625,488 153.90625,488 149.90625,487 147.90625,486 145.90625,485 143.90625,485 143.90625,484 142.90625,484"
								fill="none"
								stroke="#0029ff"
								strokeWidth="2"
								variants={{
									hidden: { pathLength: 0, opacity: 0 },
									visible: {
										pathLength: 1,
										opacity: 1,
										transition: {
											pathLength: { duration: 2, ease: "easeInOut" },
											opacity: { duration: 0.01 },
										},
									},
								}}
							/>
							<motion.polyline
								points="57.90625,482 57.90625,482 58.90625,483 61.90625,483 62.90625,483 63.90625,483 66.90625,483 68.90625,484 70.90625,484 75.90625,484 78.90625,485 81.90625,485 82.90625,485 88.90625,485 94.90625,486 98.90625,486 99.90625,486 103.90625,486 106.90625,487 109.90625,487 114.90625,487 118.90625,487 123.90625,487 127.90625,487 129.90625,487 133.90625,488 138.90625,488 146.90625,488 152.90625,488 155.90625,488 157.90625,488 162.90625,488 163.90625,488 168.90625,488 171.90625,488 177.90625,488 179.90625,488 181.90625,488 185.90625,488 186.90625,488 188.90625,488 191.90625,488 192.90625,488 195.90625,488 197.90625,488 199.90625,488 201.90625,488 202.90625,488 205.90625,488 206.90625,488 205.90625,488 204.90625,488 203.90625,488 202.90625,488 202.90625,487 200.90625,487 199.90625,487 196.90625,487 195.90625,487 194.90625,487 193.90625,487 192.90625,487 191.90625,487 189.90625,487 187.90625,487 186.90625,487 185.90625,487 184.90625,487 183.90625,487 182.90625,487 181.90625,487 180.90625,487"
								fill="none"
								stroke="#0029ff"
								strokeWidth="2"
								variants={{
									hidden: { pathLength: 0, opacity: 0 },
									visible: {
										pathLength: 1,
										opacity: 1,
										transition: {
											pathLength: {
												duration: 2,
												ease: "easeInOut",
												delay: 1.6,
											},
											opacity: { duration: 0.01, delay: 1.5 },
										},
									},
								}}
							/>
						</motion.svg>
						<p suppressHydrationWarning>
							last coffee at{" "}
							{new Date().toLocaleString("en-CA", {
								timeStyle: "short",
								hour12: false,
							})}
						</p>
					</footer>
					<hr />
					<div className="flex items-center justify-center">
						<img
							alt="barcode"
							className="w-full xl:w-[90%] h-20 pointer-events-none"
							src="/barcode.png"
						/>
					</div>
				</motion.div>
			</section>

			<section>
				<header className="flex justify-center flex-col text-center md:text-left">
					<motion.h3
						initial={{ y: 20, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.2,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						className="md:text-6xl text-4xl"
					>
						Hello, I'm Matt
					</motion.h3>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.25,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						className="md:text-2xl text-md text-gray-300"
					>
						I'm a <span className="outbound">UBC student</span> currently
						studying{" "}
						<span className="outbound">Computer Science and Mathematics</span>.
					</motion.p>
				</header>
			</section>

			<section>
				{projects.map((project, index) => (
					<motion.a
						key={project.name}
						ref={(el) => {
							ticketRefs.current[index] = el;
						}}
						initial={{ opacity: 0, scale: 0.8, rotate: 90 }}
						animate={{
							opacity: ticketsEntered[index]
								? foodOverlapsTicket[index] || snakeOverlapsTicket[index]
									? 0.25
									: 1
								: 1,
							scale: 1,
							rotate: 90 - rotation + random[index] * 10 * index,
						}}
						transition={{
							duration: 0.4,
							delay: 0.5 + index * 0.2,
							ease: [0.48, 0.15, 0.25, 0.96],
							opacity: ticketsEntered[index]
								? { duration: 0.1, delay: 0 }
								: undefined,
						}}
						onAnimationComplete={() =>
							setTicketsEntered((prev) => {
								const next = [...prev];
								next[index] = true;
								return next;
							})
						}
						href={project.link}
						target="_blank"
						className="hidden lg:flex cursor-pointer absolute select-none text-black shadow-lg"
						style={positions[index % positions.length]}
					>
						<Ticket
							name={project.name}
							color={project.color}
							desc={project.desc}
							date={project.date}
							number={project.number}
						/>
					</motion.a>
				))}
			</section>

			<div style={{ marginLeft: 0 }} className="fixed bottom-5 left-5 z-50">
				<Lanyard lanyard={lanyard} />
			</div>
		</main>
	);
}
