import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { WEBHOOK_URL } from "../../lib/types/constants";

type Incoming = {
  name: string;
  body: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ data: "Method not allowed" });

  const incoming = req.body as Incoming;

  if (!incoming) return res.status(406);

  if (incoming.name.length < 1)
    return res.status(406).json({ data: "NAME_EMPTY" });
  if (incoming.body.length < 1)
    return res.status(406).json({ data: "BODY_EMPTY" });

  if (incoming.name.length > 1000)
    return res.status(406).json({ data: "NAME_TOO_LONG" });
  if (incoming.body.length > 30)
    return res.status(406).json({ data: "BODY_TOO_LONG" });

  if (!WEBHOOK_URL) throw new Error("Missing env.WEBHOOK_URL");

  axios
    .post(WEBHOOK_URL, {
      embeds: [
        {
          description: incoming.body,
          author: {
            name: incoming.name,
          },
          color: 3092790,
        },
      ],
    })
    .then((r) => {
      if (r.data.err)
        return res.status(500).json({ data: "DISCORD_API_ERROR" });
      return res.status(200).json({ data: "MESSAGE_SENT" });
    });
}
