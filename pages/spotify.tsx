import Head from "next/head";
import { useRouter } from "next/router";

import { Wrapper } from "../lib/assets/wrapper";

import Background from "../lib/ui/background";
import Song from "../lib/ui/song";
import Track from "../lib/ui/track";
import { NextSeo } from "next-seo";
import { LanyardResponse } from "../lib/types/LanyardResponse";

export async function getServerSideProps() {
  const res = await fetch(
    "https://api.lanyard.rest/v1/users/291050399509774340"
  );

  const lanyard: LanyardResponse = await res.json();

  const response = await fetch(
    `https://presence.vercel.app/api/spotify/track/${lanyard.data?.spotify?.track_id}?type=base64`
  );

  const presence = await response.json();

  return {
    props: { presence, lanyard },
  };
}

export default function Spotify(props: {
  presence: { data: string };
  lanyard: LanyardResponse;
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="spotify"
        titleTemplate="%s | matt.mdx"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "spotify - matt.mdx",
          description: "Student and Typescript Developer.",
          images: [
            {
              url: `${
                props.lanyard.data?.listening_to_spotify
                  ? props.presence.data
                  : "https://github.com/punctuations.png"
              }`,
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
