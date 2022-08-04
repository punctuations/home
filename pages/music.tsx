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
import Nav from "../lib/assets/nav";
import { Globe } from "../lib/assets/globe";
import React from "react";
import { LangProvider } from "../lib/assets/LangProvider";
import axios from "axios";
import { MusicResponse } from "../lib/types/MusicResponse";

export async function getServerSideProps() {
  const data = await axios
    .get(
      process.env.NODE_ENV === "production"
        ? "https://dont-ping.me/api/music"
        : "http://0.0.0.0:3000/api/music"
    )
    .then((r) => r.data);

  return {
    props: { data },
  };
}

export default function Music(props: { data: MusicResponse }) {
  const router = useRouter();
  return (
    <LangProvider>
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
        <section className="mx-2 overflow-x-scroll grid col-span-2 md:grid-rows-2 md:grid-flow-col grid-flow-rows gap-x-3 gap-y-4">
          {props.data.tracks.map((song, i) => {
            try {
              if (!song.name || !song.artist || !song.image || !song.link)
                throw new Error("Missing Field");
              return (
                <div key={song.id} className="group w-56 relative">
                  <div
                    style={{ width: 224, height: 224 }}
                    onClick={() => {
                      router.push(song.link);
                    }}
                    className="z-10 cursor-pointer flex flex-col transition-color duration-200 rounded-xl bg-transparent dark:group-hover:bg-black group-hover:bg-white dark:group-hover:bg-opacity-40 group-hover:bg-opacity-50 absolute"
                  >
                    <div className="absolute bottom-3 pl-2 transition-all duration-200 text-transparent group-hover:text-black dark:group-hover:text-white">
                      <h4 className="text-xl font-bold">{song.name}</h4>
                      <p className="text-md font-semibold">{song.artist}</p>
                    </div>
                  </div>
                  <Image
                    width={224}
                    height={224}
                    alt={song.name}
                    src={song.image}
                    placeholder="blur"
                    blurDataURL={song.image}
                    className="rounded-xl"
                  />
                </div>
              );
            } catch {
              return (
                <div key={i} className="group w-56 relative">
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
        <div className="flex flex-row space-x-4">
          <Globe />
          <Toggle />
        </div>

        <Fullscreen
          query={
            Array.isArray(router.query.code)
              ? router.query.code[0]
              : router.query.code
          }
        />
      </Extras>
    </LangProvider>
  );
}
