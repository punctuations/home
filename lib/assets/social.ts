/**
 * @type {
 * {
 *  twitter: {
 *   name: string,
 *   discriminator: string | null,
 *   at: string, href: string
 *   },
 *  github: {
 *   name: string,
 *   discriminator: string | null,
 *   at: string,
 *   href: string
 *   },
 *  discord: {
 *   name: string,
 *   discriminator: string | null,
 *   at: string, href: string
 *   },
 *  email: {
 *   name: string,
 *   discriminator: string | null,
 *   at: string,
 *   href: string
 *   }
 *  }
 * }
 */
export const Socials = {
  twitter: {
    name: "matt",
    discriminator: null,
    at: "@atmattt",
    href: "https://twitter.com/atmattt",
  },
  github: {
    name: "Matt",
    discriminator: null,
    at: "punctuations",
    href: "https://github.com/punctuations",
  },
  discord: {
    name: "mattt",
    discriminator: "0596",
    at: "mattt#0596",
    href: "https://discord.com/users/291050399509774340",
  },
  email: {
    name: "matt",
    discriminator: null,
    at: "matt@dont-ping.me",
    href: "mailto:matt@dont-ping.me",
  },
};
