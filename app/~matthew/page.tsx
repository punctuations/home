import type { Metadata } from "next";
import Portrait from "@/components/Portrait";

export const metadata: Metadata = {
  title: "~matthew",
  description: "Optimization and graph theory",
};

const research = [
  {
    title: "Graph neural networks",
    status: "in progress, no preprint",
    in_progress: true,
  },
  {
    title: "Optimization",
    status: "in progress, no preprint",
    in_progress: true,
  },
];

export default function Page() {
  return (
    <main className="academic relative h-[100dvh] overflow-hidden font-[Helvetica,Arial,sans-serif] text-black [&_a:hover]:underline">
      <Portrait />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-[6vh] overflow-y-auto px-[8vw] py-[7vh] plane:block plane:gap-0 plane:overflow-visible plane:p-0">
        <div className="plane:contents">
          <div className="text-right plane:absolute plane:right-[18vw] plane:top-[45vh]">
            <h1 className="text-[48px] font-bold uppercase leading-[40px] sm:text-[64px] sm:leading-[60px]">
              M. Baker
            </h1>
            <h2 className="text-[28px] font-normal leading-[28px] max-sm:text-[22px] max-sm:leading-[24px]">
              Optimization &amp; Graph Theory
            </h2>
          </div>

          <div className="ml-auto mt-[14px] max-w-[380px] text-[15px] leading-[1.55] text-right plane:absolute plane:right-[18vw] plane:top-[56vh] plane:ml-0 plane:mt-0">
            <p>
              I work on optimization and graph theory, and on the intersection
              between them.
            </p>
            <p className="mt-[14px]">
              Behind the text is the phase plane of the Morris-Lecar equations.
            </p>
          </div>
        </div>

        <div className="plane:contents">
          <div className="w-full max-w-[330px] text-left plane:absolute plane:bottom-[14vh] plane:left-[8vw] plane:w-[330px]">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.06em]">
              Research
            </h3>

            <ol className="mt-[14px]">
              {research.map((item, n) => (
                <li key={item.title} className="mt-[12px] flex gap-[12px]">
                  <span className="w-[26px] shrink-0 text-[15px] leading-[1.4] tabular-nums">
                    [{n + 1}]
                  </span>
                  <span>
                    <span
                      className={`block text-[15px] leading-[1.4]${
                        item.in_progress
                          ? " underline decoration-dashed decoration-1 cursor-help"
                          : ""
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="block text-[13px] leading-[1.4] text-black/55">
                      {item.status}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-[22px] text-[15px] leading-[1.55] plane:absolute plane:bottom-[6vh] plane:left-[8vw] plane:mt-0">
            <span>m [at] thew [dot] sh</span>
            <span className="px-[10px]">/</span>
            <a
              href="https://github.com/punctuations"
              rel="me noreferrer"
              target="_blank"
            >
              github
            </a>
            <span className="px-[10px]">/</span>
            <a href="/">thew.sh</a>
          </p>
        </div>
      </div>
    </main>
  );
}
