import React from "react";
import { useRouter } from "next/router";

import { Activity, useLanyard } from "use-lanyard";
import { useListenAlong } from "use-listen-along";

const Fullscreen = (props: { query: string | undefined }) => {
  const [auth, setAuth] = React.useState<string | null>(null);

  const [connection, setConnection] = React.useState<boolean>(false);
  const [disconnect, setDisconnection] = React.useState<boolean>(true);

  const snowflake = "291050399509774340";
  const { data: lanyard } = useLanyard(snowflake);

  const router = useRouter();

  const { connected, error } = useListenAlong(
    snowflake,
    auth ? auth : "",
    props.query && auth ? disconnect : true
  );

  function listen(disconnect: boolean) {
    // Get auth from spotify with scope 'user-modify-playback-state'.
    if (!props.query) {
      router.push(
        "https://accounts.spotify.com/authorize" +
          "?response_type=code" +
          `&client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}` +
          `&scope=${encodeURIComponent(
            "user-modify-playback-state user-read-currently-playing"
          )}` +
          `&redirect_uri=${encodeURIComponent(
            process.env.NODE_ENV === "development"
              ? "http://0.0.0.0:3000" // REPLACE WITH YOUR URL
              : "https://dont-ping.me"
          )}`
      );
    } else {
      const data = new URLSearchParams();
      data.append("grant_type", "authorization_code");
      data.append("code", props.query);
      data.append(
        "redirect_uri",
        process.env.NODE_ENV === "development"
          ? "http://0.0.0.0:3000" // REPLACE WITH YOUR URL
          : "https://dont-ping.me"
      );

      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: data,
      })
        .then((r) => r.json())
        .then((r) => setAuth(r.access_token));
    }
    setConnection(connected);
    setDisconnection(disconnect);
  }

  return (
    <>
      {lanyard?.listening_to_spotify ? (
        <div className="flex flex-row space-x-4 justify-center items-center">
          <button
            onClick={() => listen(connection)}
            className="duration-500 transition-colors px-3 py-1 bg-white dark:bg-black rounded-md border-gray-600 dark:hover:border-white hover:border-black text-gray-600 dark:hover:text-white hover:text-black border"
          >
            {connection ? "Disconnect" : "Listen Along"}
          </button>
          <svg
            onClick={() => router.push("/spotify")}
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </div>
      ) : null}
    </>
  );
};

export default Fullscreen;
