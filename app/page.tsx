import Home from "@/components/Client";
import { fac } from "@/lib/color";

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

async function getDiscordPreview() {
	const snowflake = "291050399509774340";
	const res = await fetch(`https://api.lanyard.rest/v1/users/${snowflake}`, {
		next: { revalidate: 60 },
	});
	const { data } = await res.json();

	const avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.webp?size=128`;
	const bannerUrl = data.discord_user.banner
		? `https://cdn.discordapp.com/banners/${data.discord_user.id}/${data.discord_user.banner}.webp?size=300`
		: null;

	const avg = await fac(avatarUrl);

	return {
		displayName: data.discord_user.global_name ?? data.discord_user.username,
		username: data.discord_user.username,
		avatarUrl,
		bannerUrl,
		avg,
		listening: data.activities.find((a: any) => a.type === 2)?.state,
		ws: undefined,
		status: data.discord_status,
	};
}

export default async function Page() {
	const gh = await getGithubPreview();
	const dc = await getDiscordPreview();
	return <Home gh={gh} dc={dc} />;
}
