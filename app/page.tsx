import Home from "@/components/Client";
import { fac } from "@/lib/color";
import { type Types } from "use-lanyard";

const SNOWFLAKE = "291050399509774340";

async function getGithubPreview() {
	const res = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `{
        user(login: "punctuations") {
          name
          login
          bio
          avatarUrl
          contributionsCollection {
            contributionCalendar {
              weeks { contributionDays { contributionCount } }
            }
          }
        }
      }`,
		}),
		next: { revalidate: 3600 },
	});

	const { data } = await res.json();
	const user = data.user;

	return {
		displayName: user.name,
		username: user.login,
		bio: user.bio,
		avatarUrl: user.avatarUrl,
		contributionWeeks: user.contributionsCollection.contributionCalendar.weeks,
	};
}

async function getPresence(): Promise<Types.Presence> {
	const res = await fetch(`https://api.lanyard.rest/v1/users/${SNOWFLAKE}`, {
		next: { revalidate: 60 },
	});
	const { data } = await res.json();
	return data;
}

async function getLastUpdate() {
	const res = await fetch("https://api.github.com/repos/punctuations/home", {
		headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
		next: { revalidate: 3600 },
	});
	const data = await res.json();
	return (data.updated_at as string) ?? new Date().toISOString();
}

async function toDiscordPreview(data: Types.Presence) {
	const user = data.discord_user as Types.DiscordUser & {
		banner?: string | null;
	};
	const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128`;
	const bannerUrl = user.banner
		? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.webp?size=300`
		: null;

	return {
		displayName: data.discord_user.global_name ?? data.discord_user.username,
		username: data.discord_user.username,
		avatarUrl,
		bannerUrl,
		avg: bannerUrl ? "" : await fac(avatarUrl),
		listening: data.activities.find((a) => a.type === 2)?.state,
		status: data.discord_status,
	};
}

export default async function Page() {
	const [gh, presence, lastUpdate] = await Promise.all([
		getGithubPreview(),
		getPresence(),
		getLastUpdate(),
	]);

	const dc = await toDiscordPreview(presence);

	return <Home gh={gh} dc={dc} presence={presence} lastUpdate={lastUpdate} />;
}
