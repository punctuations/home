import { useRouter } from "next/router";

export const Language = () => {
  const router = useRouter();

  return (
    <svg
      onClick={() => router.push(`https://fr.dont-ping.me${router.pathname}`)}
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-6 right-6 z-10 h-6 w-6 text-gray-400 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    </svg>
  );
};
