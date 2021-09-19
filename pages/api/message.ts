import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { WEBHOOK_URL } from "../../lib/types/constants";

type Incoming = {
  name: string;
  body: string;
  phone: string | null;
  email: string | null;
  twitter: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ data: "Method not allowed" });

  const incoming = req.body as Incoming;

  if (!incoming) return res.status(406);

  if (incoming.name.length < 1)
    return res.status(406).json({ data: "NAME_EMPTY" });
  if (incoming.body.length < 1)
    return res.status(406).json({ data: "BODY_EMPTY" });

  if (incoming.name.length > 30)
    return res.status(406).json({ data: "NAME_TOO_LONG" });
  if (incoming.body.length > 1000)
    return res.status(406).json({ data: "BODY_TOO_LONG" });
  if (incoming.phone && incoming.phone.length > 15)
    return res.status(406).json({ data: "PHONE_TOO_LONG" });
  if (incoming.email && incoming.email.length > 150)
    return res.status(406).json({ data: "EMAIL_TOO_LONG" });
  if (incoming.twitter && incoming.twitter.length > 16)
    return res.status(406).json({ data: "TWITTER_TOO_LONG" });

  if (!WEBHOOK_URL) throw new Error("Missing env.WEBHOOK_URL");

  axios
    .post(WEBHOOK_URL, {
      avatar_url:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcompote.slate.com%2Fimages%2Fa2a0778b-c50f-4886-b944-0b004b946bd8.jpeg%3Fwidth%3D780%26height%3D520%26rect%3D1560x1040%26offset%3D0x0&f=1&nofb=1",
      embeds: [
        {
          description:
            incoming.email && incoming.phone
              ? `${incoming.email} • ${incoming.phone}`
              : incoming.email ?? incoming.phone,
          author: {
            name: `💬 / ${incoming.name}`,
            url: `${
              incoming.twitter
                ? `https://twitter.com/${incoming.twitter?.split("@").pop()}`
                : ""
            }`,
            icon_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              incoming.name
            )}&background=8a8d95&color=fff`,
          },
          thumbnail: {
            url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Feugenekevin.github.io%2FSiri.png&f=1&nofb=1",
          },
          fields: [
            {
              name: ":inbox_tray:",
              value: `\`\`\`${incoming.body}\`\`\``,
            },
          ],
          color: 3092790,
          footer: { text: "Siri" },
          timestamp: new Date().toISOString(),
        },
      ],
    })
    .then((r) => {
      if (r.data.err)
        return res.status(500).json({ data: "DISCORD_API_ERROR" });
      return res.status(200).json({ data: "MESSAGE_SENT" });
    });
}
