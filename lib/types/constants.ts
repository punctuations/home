export const WEBHOOK_URL = process.env.WEBHOOK_URL;
export const LAST_FM_API_KEY = process.env.LAST_FM_API_KEY;

export const chat = {
  hidden: { y: 100, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.75,
    },
  },
};

export const message = {
  hidden: {
    y: 100,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  },
};
