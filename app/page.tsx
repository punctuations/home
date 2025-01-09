"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HexColorPicker } from "react-colorful";
import Lanyard from "@/components/Lanyard";

export default function Home() {
  const [windowsWidth, setWindowsWidth] = useState(0);

  useEffect(() => {
    setWindowsWidth(window.innerWidth);
  }, []);

  const [lastUpdate, setUpdate] = useState<Date>(new Date("Dec 14 2024"));

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("https://api.github.com/repos/punctuations/home");
      const data = await res.json();
      setUpdate(new Date(data.updated_at));
    }
    fetchPosts();
  }, []);

  const getBlocks = () => {
    const blockSize = windowsWidth * 0.05;
    const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
    return [...Array(nbOfBlocks).keys()].map((_, index) => {
      return (
        <div
          onMouseEnter={(e) => {
            colorize(e.target);
          }}
          key={index}
        ></div>
      );
    });
  };

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

  //   // Memoize rotation and scale to prevent recalculation
  //   const rotation = useMemo(() => {
  //     const randomRotation = Math.random() * (12 - 6) + 6;
  //     return Math.random() > 0.5 ? randomRotation : -randomRotation;
  //   }, []);

  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState<{ x: number; y: number }[][]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>(
    []
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const recieptRef = useRef<HTMLDivElement>(null);

  const startDrawing = (
    e: React.MouseEvent<SVGSVGElement | HTMLDivElement>
  ) => {
    const point = getCoordinates(e);
    setDrawing(true);
    setCurrentLine([point]);
  };

  const draw = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
    if (!drawing) return;
    const point = getCoordinates(e);

    setCurrentLine((prevLine) => [...prevLine, point]);
  };

  const endDrawing = () => {
    if (drawing) {
      setLines((prevLines) => [...prevLines, currentLine]);
      setColors((prevColors) => [...prevColors, color]);
      setCurrentLine([]);
      setDrawing(false);
    }
  };

  const getCoordinates = (
    e: React.MouseEvent<SVGSVGElement | HTMLDivElement>
  ): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const svgRect = svg.getBoundingClientRect();

    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    return { x, y };
  };

  const [isOpen, setOpen] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#ff0000");

  return (
    <main className="absolute w-full h-full flex items-center justify-center flex-col-reverse md:flex-row md:space-x-24 space-x-0 space-y-16 md:space-y-0 mt-6 sm:mt-0">
      <div className="z-50 absolute top-3 left-3 hidden md:block">
        <AnimatePresence>
          <motion.button
            title="Color Picker"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              delay: 0.6,
              ease: [0.48, 0.15, 0.25, 0.96],
            }}
            onClick={() => setOpen((b) => !b)}
            className="gradient border-2 border-white rounded-full w-6 h-6"
          />
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                delay: 0,
                ease: [0.48, 0.15, 0.25, 0.96],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              key="color-picker"
              className="ml-6 p-3 shadow-lg bg-white rounded-md"
            >
              <HexColorPicker
                className="w-16 h-16"
                color={color}
                onChange={setColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="bgrid select-none" style={{ marginLeft: 0 }}>
        {windowsWidth > 0 &&
          [...Array(20).keys()].map((_, index) => {
            return (
              <div key={"b_" + index} className="bcolumn">
                {getBlocks()}
              </div>
            );
          })}
      </div>

      <section
        style={{
          transformOrigin: "center",
        }}
        className="relative min-w-64 w-3/6 sm:w-1/3 md:w-auto"
      >
        {/* Drawing SVG */}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          style={{
            zIndex: 20,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <clipPath id="recieptClip">
            <rect
              transform={`rotate(${rotation} ${
                (recieptRef.current?.offsetWidth ?? 2) / 2
              } ${(recieptRef.current?.offsetHeight ?? 2) / 2})`}
              x={recieptRef.current?.offsetLeft ?? 0}
              y={recieptRef.current?.offsetTop ?? 0}
              width={recieptRef.current?.offsetWidth ?? 0}
              height={recieptRef.current?.offsetHeight ?? 0}
            />
          </clipPath>
          <g clipPath="url(#recieptClip)">
            {lines.map((line, index) => (
              <polyline
                key={index}
                points={line.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke={colors[index]}
                strokeWidth="2"
              />
            ))}
            <polyline
              points={currentLine
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
          </g>
        </svg>

        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: 1,
            rotate: rotation,
          }}
          transition={{
            duration: 0.4,
            delay: 0,
            ease: [0.48, 0.15, 0.25, 0.96],
          }}
          ref={recieptRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="relative select-none cursor-crosshair reciept text-black rounded-sm px-6 py-4"
        >
          <header>
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-2xl">A 'lil about me</h3>
              <h3>matt</h3>
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
              className="rounded-lg h-60 pointer-events-none"
              src="/h.png"
            />
          </div>
          <hr className="!border-solid" />
          <div className="flex flex-row justify-between items-center text-lg">
            <p>location</p>
            <p>vancouver</p>
          </div>
          <div className="flex flex-row justify-between items-center text-lg">
            <p>timezone</p>
            <p>
              {
                new Date()
                  .toLocaleTimeString("en-US", {
                    timeZone: "America/Vancouver",
                    timeZoneName: "short",
                  })
                  .split(" ")[2]
              }
            </p>
          </div>

          <fieldset className="pb-2 mt-2">
            <legend>
              <h6 className="text-lg">Get in touch</h6>
            </legend>

            <div
              id="socials"
              className="flex flex-row justify-between items-center space-x-2 md:space-x-0 text-lg"
            >
              <a
                className="flex underline z-30 cursor-pointer"
                title="twitter"
                href={"/twitter"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                className="flex underline z-30 cursor-pointer"
                title="discord"
                href={"/discord"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
              <a
                className="flex underline z-30 cursor-pointer"
                title="github"
                href={"/github"}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="flex underline z-30 cursor-pointer"
                title="email"
                href="mailto:hey@mattt.space"
                target="_blank"
                rel="noopener noreferrer"
              >
                Email
              </a>
            </div>
          </fieldset>
          <footer className="mt-14 flex flex-col items-center justify-center text-lg">
            <svg
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
            >
              <polyline
                points="82.90625,485 82.90625,486 83.90625,486 84.90625,486 85.90625,486 86.90625,486 87.90625,486 88.90625,486 89.90625,486 90.90625,486 91.90625,486 92.90625,486 93.90625,486 93.90625,487 92.90625,488 91.90625,489 90.90625,490 89.90625,491 88.90625,492 88.90625,493 89.90625,493 90.90625,493 92.90625,492 94.90625,491 96.90625,491 98.90625,490 101.90625,489 103.90625,488 104.90625,488 105.90625,488 106.90625,488 106.90625,489 106.90625,490 106.90625,491 106.90625,492 108.90625,492 110.90625,492 113.90625,492 115.90625,492 120.90625,492 124.90625,491 128.90625,491 134.90625,491 138.90625,491 143.90625,491 148.90625,491 154.90625,492 160.90625,493 166.90625,495 171.90625,496 177.90625,497 183.90625,498 188.90625,498 194.90625,498 198.90625,498 202.90625,498 205.90625,498 208.90625,498 209.90625,498 210.90625,498 210.90625,497 210.90625,496 209.90625,495 207.90625,494 204.90625,492 200.90625,491 195.90625,489 190.90625,487 185.90625,486 180.90625,484 174.90625,483 170.90625,482 167.90625,482 165.90625,481 164.90625,481"
                fill="none"
                stroke="#0029ff"
                stroke-width="2"
              ></polyline>
              <polyline
                points="153.90625,480 152.90625,480 151.90625,479 150.90625,479 149.90625,479 148.90625,479"
                fill="none"
                stroke="#0029ff"
                stroke-width="2"
              ></polyline>
            </svg>
            <p>
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

      <div style={{ marginLeft: 0 }} className="fixed bottom-5 left-5 z-50">
        <Lanyard />
      </div>
    </main>
  );
}
