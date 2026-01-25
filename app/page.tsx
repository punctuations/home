"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HexColorPicker } from "react-colorful";
import Lanyard from "@/components/Lanyard";
import Ticket from "@/components/Ticket";

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
      name: "presence",
      color: "#9E7B3A",
      link: "https://github.com/punctuations/presence",
      desc: "a video/image converter to audio waveform",
      date: "August 1, 2021",
      number: "0003",
    },
    {
      name: "jtp",
      color: "#3B4C5C",
      link: "https://github.com/punctuations/jtp",
      desc: "a high-performance binary protocol for images",
      date: "January, 24 2026",
      number: "0004",
    },
  ];

  const [random, setRandom] = useState<number[]>([]);
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
            className="gradient rounded-full w-6 h-6 relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                delay: 0.7,
                ease: [0.48, 0.15, 0.25, 0.96],
              }}
              className="gradient blurred h-24 w-24 -z-10 absolute -top-[150%] -left-[150%] translate-x-1/2 translate-y-1/2"
            />
          </motion.button>
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
        className="relative min-w-64 max-w-72 w-3/6 sm:w-1/3 md:w-auto"
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
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
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
              ></motion.polyline>
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
              ></motion.polyline>
            </motion.svg>
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

      <section>
        {projects.map((project, index) => {
          return (
            <motion.a
              initial={{
                opacity: 0,
                scale: 0.8,
                rotate: 90,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 90 - rotation + random[index] * 10 * index,
              }}
              transition={{
                duration: 0.4,
                delay: 0.5 + index * 0.2,
                ease: [0.48, 0.15, 0.25, 0.96],
              }}
              href={project.link}
              target="_blank"
              key={project.name}
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
          );
        })}
      </section>

      <div style={{ marginLeft: 0 }} className="fixed bottom-5 left-5 z-50">
        <Lanyard />
      </div>
    </main>
  );
}
