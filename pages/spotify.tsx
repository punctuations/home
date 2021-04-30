import Head from "next/head";
import { useRouter } from "next/router";
import { useLanyard } from "use-lanyard";

import { Wrapper } from "../lib/assets/wrapper";

import Background from "../lib/ui/background";
import Song from "../lib/ui/song";
import Track from "../lib/ui/track";
import { NextSeo } from "next-seo";

export default function Spotify() {
  const snowflake = "291050399509774340";
  const { data: lanyard } = useLanyard(snowflake);

  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      {lanyard?.listening_to_spotify ? (
        <NextSeo
          title={`${lanyard?.spotify?.song} - ${lanyard?.spotify?.artist}`}
          titleTemplate="%s | matt.mdx"
          description={`${lanyard?.spotify?.song} by ${lanyard?.spotify?.artist} from ${lanyard?.spotify?.album}`}
          openGraph={{
            type: "website",
            url: "https://dont-ping.me/",
            title: `${lanyard?.spotify?.song} | matt.mdx`,
            description: `${lanyard?.spotify?.song} by ${lanyard?.spotify?.artist} from ${lanyard?.spotify?.album}`,
            images: [
              {
                url: `${lanyard?.spotify?.album_art_url}`,
                width: 400,
                height: 200,
              },
            ],
          }}
          twitter={{
            handle: "@atmattt",
            site: "@atmattt",
            cardType: "summary_large_image",
          }}
        />
      ) : (
        <NextSeo
          title="spotify"
          titleTemplate="%s | matt.mdx"
          description="Not listening to anything right now — Student and Typescript Developer."
          openGraph={{
            type: "website",
            url: "https://dont-ping.me/",
            title: "spotify - matt.mdx",
            description:
              "Not listening to anything right now — Student and Typescript Developer.",
            images: [
              {
                url: "https://github.com/punctuations.png",
                width: 400,
                height: 200,
              },
            ],
          }}
          twitter={{
            handle: "@atmattt",
            site: "@atmattt",
            cardType: "summary_large_image",
          }}
        />
      )}

      <Background />

      <Song />

      <Wrapper>
        <Track />
      </Wrapper>

      <svg
        onClick={() => router.push("/")}
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 cursor-pointer absolute left-6 bottom-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16l-4-4m0 0l4-4m-4 4h18"
        />
      </svg>
    </>
  );
}
