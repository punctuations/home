import { motion } from "framer-motion";
import axios from "axios";
import React from "react";

const Form = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string | null>(null);
  const [body, setBody] = React.useState<string | null>(null);

  const names = [
    "Matt",
    "Johnny",
    "Johnathon",
    "John",
    "Joe",
    "Jane",
    "Foo",
    "Bar",
    "Alice",
    "Bob",
    "Coolguy123",
    "Swagmaster_the_third",
    "You",
    "Placeholder Name Here",
    "Lorem Ipsum",
  ];

  const send = async () => {
    if (!name || !body) return setError("Please fill in all the fields.");

    const res = await axios.post("/api/message", {
      name,
      body,
    });

    if (res.data.data === "NAME_EMPTY" || res.data.data === "MESSAGE_EMPTY")
      return setError("Please fill in all the fields.");

    if (res.data.data === "NAME_TOO_LONG")
      return setError("Name field is too long.");
    if (res.data.data === "MESSAGE_TOO_LONG")
      return setError("Name field is too long.");

    if (res.data.data === "DISCORD_API_ERROR")
      return setError("Connection could not be established with discord.");

    return setSuccess(true);
  };

  return (
    <section className="flex flex-col space-y-6 items-center justify-center w-5/6">
      <p className="self-start ml-14 uppercase font-semibold text-xs text-red-400">
        {error && !success && `error: ${error}`}
      </p>
      <motion.form
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.4,
            delay: 0.15,
            ease: [0.48, 0.15, 0.25, 0.96],
          },
        }}
        className="p-4 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 grid grid-cols-2 gap-y-5 rounded-lg w-10/12 bg-white dark:bg-black"
      >
        <div className="col-span-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 flex flex-row text-gray-500 focus-within:text-gray-600 transition-colors duration-200 rounded-md relative w-full px-3 py-2 border border-gray-300 dark:border-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="currentColor"
            className="inline-block mr-2"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="name"
            name="Name"
            type="text"
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white dark:bg-black appearance-none w-full inline-block placeholder-gray-500 text-gray-900 dark:text-gray-400 focus:outline-none focus:z-10 sm:text-sm"
            placeholder={names[Math.floor(Math.random() * names.length)]}
          />
        </div>

        <div className="col-span-2 row-span-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 flex flex-row text-gray-400 focus-within:text-gray-600 transition-colors duration-200 rounded-md relative w-full px-3 py-2 border border-gray-300 dark:border-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="currentColor"
            className="inline-block absolute bottom-0 mb-2 mr-2"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <textarea
            id="body"
            name="Body"
            maxLength={1000}
            spellCheck={true}
            onChange={(e) => setBody(e.target.value)}
            required
            className="bg-white dark:bg-black resize-none appearance-none w-full h-full inline-block placeholder-gray-500 text-gray-900 dark:text-gray-400 focus:outline-none focus:z-10 sm:text-sm"
            placeholder="Body (max 1000 char.)"
          />
        </div>
        <br />
        {success ? (
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="disabled group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Sent
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              send();
            }}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </span>
            Send
          </button>
        )}
      </motion.form>
    </section>
  );
};

export default Form;
