"use client";
import { AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface LinkPreviewProps {
	overlap: boolean;
	parentOverlap: boolean;
	href: string;
	label: string;
	children: React.ReactNode;
	rot?: number;
	ref: (el: HTMLDivElement | null) => void;
}

export function PolaroidLink({
	overlap,
	parentOverlap,
	href,
	label,
	children,
	rot,
	ref,
}: LinkPreviewProps) {
	const [hovered, setHovered] = useState(false);
	const [pos, setPos] = useState({ top: 0, left: 0 });
	const anchorRef = useRef<HTMLAnchorElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!hovered || !anchorRef.current) return;
		const rect = anchorRef.current.getBoundingClientRect();
		setPos({
			top: rect.top + window.scrollY - 12, // 12px gap above
			left: rect.left + rect.width / 2 + window.scrollX,
		});
	}, [hovered]);

	return (
		<>
			<a
				ref={anchorRef}
				className="relative flex underline z-30 cursor-pointer"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				href={href}
				title={label.toLowerCase()}
				target="_blank"
				rel="noopener noreferrer"
			>
				{label}
			</a>

			{mounted &&
				createPortal(
					<div
						ref={ref}
						aria-hidden
						style={{
							position: "absolute",
							top: pos.top,
							left: pos.left,
							transform: hovered
								? `translateX(-50%) translateY(-100%) scale(1) rotate(${
										rot ?? 0
								  }deg)`
								: `translateX(-50%) translateY(-100%) scale(0.95) rotate(${
										rot ?? 0
								  }deg)`,
							transformOrigin: "center bottom",
							opacity: hovered
								? overlap
									? 0.25
									: parentOverlap
									? 0.65
									: 1
								: 0,
							pointerEvents: "none",
							zIndex: 99999,
							transition: hovered
								? "transform 0.2s cubic-bezier(0.34,1.2,0.64,1), opacity 0.15s ease"
								: "transform 0.15s ease, opacity 0.1s ease",
						}}
					>
						<AnimatePresence mode="wait">{hovered && children}</AnimatePresence>
					</div>,
					document.body,
				)}
		</>
	);
}
