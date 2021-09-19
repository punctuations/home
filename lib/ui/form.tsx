import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import React from "react";

const Form = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<{
    body: string | null;
    state: boolean;
  }>({ body: null, state: false });

  const [name, setName] = React.useState<string | null>(null);
  const [body, setBody] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const [twitter, setTwitter] = React.useState<string | null>(null);

  const pattern = new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );

  const names = [
    "Matt",
    "Johnny Appleseed",
    "Johnathon Smith",
    "John Doe",
    "Joe",
    "Jane Doe",
    "Foo bar",
    "Bar foo",
    "Alice Bob",
    "Bob Alice",
    "Coolguy123",
    "Swagmaster_the_third",
    "You",
    "Placeholder Name Here",
    "Lorem Ipsum",
  ];

  const emailPlaceholder = [
    "elonmusk@tesla.com",
    "epicswagmaster@hotmail.com",
    "example@example.com",
    "johnny@appleseed.com",
    "coolguy@epic.com",
    "matt@dont-ping.me",
    "hotmale@hotmail.com",
    "krazygurl1881@aol.com",
    "support@myspace.com",
    "you@example.com",
  ];

  const [placeHolderEmail] = React.useState<string>(
    emailPlaceholder[Math.floor(Math.random() * emailPlaceholder.length)]
  );

  const [placeHolderName] = React.useState<string>(
    names[Math.floor(Math.random() * names.length)]
  );

  const send = async () => {
    if (!name || !body) return setError("Please fill in all the fields.");
    if (
      (!phone?.match("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$") &&
        phone !== "" &&
        phone !== null) ||
      (!email?.match(pattern) && email !== "" && email !== null)
    )
      return setError("Please enter a proper email or phone number.");
    if (!twitter?.match("@[a-z0-9]") && twitter !== "" && twitter !== null)
      return setError("Please enter a correct twitter handle.");

    const res = await axios.post("/api/message", {
      name,
      body,
      phone,
      email,
      twitter,
    });

    if (res.data.data === "NAME_EMPTY" || res.data.data === "MESSAGE_EMPTY")
      return setError("Please fill in all the fields.");

    if (res.data.data === "NAME_TOO_LONG")
      return setError("Name field is too long.");
    if (res.data.data === "MESSAGE_TOO_LONG")
      return setError("Name field is too long.");

    if (res.data.data === "DISCORD_API_ERROR")
      return setError("Connection could not be established with discord.");

    return setSuccess({ body, state: true });
  };

  return (
    <form className="absolute w-full h-full 2xl:grid xl:grid lg:grid flex grid-cols-2 place-content-center flex-col space-y-6 items-center justify-center">
      <motion.section
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.4,
            delay: 0.1,
            ease: [0.48, 0.15, 0.25, 0.96],
          },
        }}
        className="2xl:ml-24 xl:ml-24 lg:ml-24 ml-0 flex flex-col justify-center items-center space-y-6"
      >
        <div className="relative flex flex-col items-center justify-center space-y-5 w-80 py-8 rounded-md dark:border border-gray-800 bg-[#f1f2f6] dark:bg-[#1b1c1f]">
          {success.state ? (
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              disabled
              className="absolute top-4 right-4 text-sm text-gray-400"
            >
              Done
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                send();
              }}
              className="absolute top-4 right-4 text-sm text-blue-500"
            >
              Done
            </button>
          )}
          <header className="flex flex-col items-center justify-center space-y-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                name ?? placeHolderName
              )}&background=8a8d95&color=fff`}
              alt="pfp"
              className="rounded-full"
            />
            <input
              id="name"
              name="Name"
              type="text"
              maxLength={30}
              required
              placeholder={placeHolderName}
              onChange={(e) => setName(e.target.value)}
              className="flex text-xl dark:text-white text-black outline-none bg-transparent text-center"
            />
          </header>
          <section className="text-sm flex flex-col space-y-3 items-center justify-center w-full">
            <div className="dark:text-white bg-white dark:bg-[#2c2c2e] rounded-md p-2 w-10/12">
              <p className="text-xs">phone</p>
              <input
                id="phone"
                name="Phone number"
                type="tel"
                autoComplete="tel-national"
                pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
                placeholder="+12345678910"
                maxLength={15}
                onChange={(e) => setPhone(e.target.value)}
                className={`${
                  phone?.match(
                    "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
                  )
                    ? "text-blue-500"
                    : null
                } ml-2 outline-none bg-transparent`}
              />
            </div>
            <div className="dark:text-white bg-white dark:bg-[#2c2c2e] rounded-md p-2 w-10/12">
              <p className="text-xs">email</p>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder={placeHolderEmail}
                onChange={(e) => setEmail(e.target.value)}
                className={`${
                  email?.match(pattern) ? "text-blue-500" : null
                } ml-2 outline-none bg-transparent`}
              />
            </div>
            <div className="dark:text-white bg-white dark:bg-[#2c2c2e] rounded-md p-2 w-10/12">
              <p className="text-xs">twitter</p>
              <input
                type="text"
                name="twitter"
                pattern="@[a-z0-9]"
                maxLength={16}
                placeholder="@atmattt"
                onChange={(e) => setTwitter(e.target.value)}
                className={`${
                  twitter?.match("@[a-z0-9]") ? "text-blue-500" : null
                } ml-2 outline-none bg-transparent`}
              />
            </div>
          </section>
        </div>
      </motion.section>
      <motion.section
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
        className="relative w-4/6 flex flex-col space-y-4"
      >
        <AnimatePresence initial={false}>
          {success.state && (
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.4,
                  ease: [0.48, 0.15, 0.25, 0.96],
                },
              }}
              className="w-full flex justify-end -mx-8"
            >
              <p className="message-to dark:message-dark-to">{success.body}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white dark:bg-black flex flex-row text-gray-500 focus-within:text-gray-600 transition-colors duration-200 rounded-full relative w-full px-3 py-2 border border-gray-300 dark:border-gray-800">
          {success.state ? (
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="inline-block absolute bottom-0 right-0 mb-1.5 mr-2 p-0.5 bg-green-500 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                className="text-white p-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                send();
              }}
              className="inline-block absolute bottom-0 right-0 mb-1.5 mr-2 p-0.5 bg-blue-500 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                className="text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </button>
          )}
          <input
            id="message"
            name="Message"
            type="text"
            maxLength={350}
            onChange={(e) => setBody(e.target.value)}
            required
            className="bg-transparent appearance-none w-full h-auto mr-6 inline-block placeholder-gray-500 text-gray-900 dark:text-gray-400 focus:outline-none sm:text-sm"
            placeholder="Message"
          />
        </div>
        <p className="absolute left-16 top-6 uppercase font-semibold text-xs text-red-400">
          {error && !success.state && `error: ${error}`}
        </p>
      </motion.section>
    </form>
  );
};

export default Form;
