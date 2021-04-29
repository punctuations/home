import { useRouter } from "next/router";

import { Activity, useLanyard } from "use-lanyard";

const Fullscreen = () => {
  const snowflake = "291050399509774340";
  const { data: lanyard } = useLanyard(snowflake);

  const router = useRouter();

  return (
    <>
      {lanyard?.listening_to_spotify ? (
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
      ) : null}
    </>
  );
};

export default Fullscreen;
