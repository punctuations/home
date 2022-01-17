import Head from "next/head";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { Main } from "../lib/assets/main";
import { Presence } from "../lib/assets/presence";
import { Extras } from "../lib/assets/extras";

import Page from "../lib/ui/page";

import Lanyard from "../lib/ui/lanyard";
import { Toggle } from "../lib/assets/toggle";
import Fullscreen from "../lib/ui/fullscreen";
import { Songs } from "../lib/assets/music";
import Nav from "../lib/assets/nav";

export default function Music() {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="music"
        titleTemplate="%s | matt"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "music - matt",
          description: "Student and Typescript Developer.",
          images: [
            {
              url: "/full.png",
              width: 1224,
              height: 719,
            },
          ],
        }}
        twitter={{
          handle: "@atmattt",
          site: "@atmattt",
          cardType: "summary_large_image",
        }}
      />

      <Page />

      <Main>
        <Nav />
        <section className="mx-2 overflow-scroll grid col-span-2 md:grid-rows-2 md:grid-flow-col grid-flow-rows gap-x-3 gap-y-4">
          {Songs.map((song, i) => {
            try {
              if (
                !song.name ||
                !song.artists ||
                song.artists[0] === "" ||
                !song.album_cover ||
                !song.link
              )
                throw new Error("Missing Field");
              return (
                <div className="group w-56 relative">
                  <div
                    style={{ width: 224, height: 224 }}
                    onClick={() => {
                      router.push(song.link);
                    }}
                    className="z-10 cursor-pointer flex flex-col transition-color duration-200 rounded-xl bg-transparent dark:group-hover:bg-black group-hover:bg-white dark:group-hover:bg-opacity-40 group-hover:bg-opacity-50 absolute"
                  >
                    <div className="absolute bottom-3 pl-2 transition-all duration-200 text-transparent group-hover:text-black dark:group-hover:text-white">
                      <h4 className="text-xl font-bold">{song.name}</h4>
                      <p className="text-md font-semibold">
                        {song.artists.join("; ")}
                      </p>
                    </div>
                  </div>
                  <Image
                    width={224}
                    height={224}
                    alt={song.name}
                    src={song.album_cover}
                    placeholder="blur"
                    blurDataURL={song.album_cover}
                    className="rounded-xl"
                  />
                </div>
              );
            } catch {
              return (
                <div className="group w-56 relative">
                  <div className="bg-red-500 rounded-xl flex flex-col rounded-xl absolute w-full h-full">
                    <div className="absolute bottom-3 pl-2 text-white">
                      <h4 className="text-2xl font-bold">An error occurred</h4>
                      <p className="text-md font-semibold">
                        Sorry, something went wrong.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </section>
      </Main>

      <Presence>
        <Lanyard />
      </Presence>

      <Extras>
        <Toggle />
        <Fullscreen
          query={
            Array.isArray(router.query.code)
              ? router.query.code[0]
              : router.query.code
          }
        />
      </Extras>
    </>
  );
}
