"use client";

import { motion } from "motion/react";

interface ContributionWeek {
	contributionDays: { contributionCount: number }[];
}

export interface GithubProps {
	username: string;
	displayName: string;
	bio: string;
	avatarUrl: string;
	contributionWeeks: ContributionWeek[];
}

export const Github: React.FC<GithubProps> = ({
	username,
	displayName,
	bio,
	avatarUrl,
	contributionWeeks,
}) => {
	return (
		<div
			style={{
				width: "240px",
				border: "1px solid rgba(0,0,0,0.08)",
				borderRadius: "8px",
				boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.12)",
				fontFamily: "monospace",
				overflow: "hidden",
			}}
			className="reciept"
		>
			{/* graph */}
			<div style={{ padding: "8px 12px 12px" }}>
				{/* month labels */}
				<div style={{ display: "flex", marginBottom: "4px" }}>
					{getMonthLabels().map((m, i) => (
						<div
							key={i}
							style={{
								flex: 1,
								fontSize: "8px",
								color: "#94a3b8",
								letterSpacing: "0.03em",
							}}
						>
							{m}
						</div>
					))}
				</div>

				{/* weeks grid */}
				<div style={{ display: "flex", gap: "3px" }}>
					{contributionWeeks.slice(-16).map((week, wi) => (
						<div
							key={wi}
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "2px",
								flex: 1,
							}}
						>
							{week.contributionDays.map((day, di) => (
								<motion.div
									initial={{ opacity: 0, y: 4 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.1,
											delay: 0.03 * (di + wi),
											ease: [0.48, 0.15, 0.25, 0.96],
										},
									}}
									key={di}
									title={`${day.contributionCount} contributions on this day`}
									style={{
										aspectRatio: "1",
										width: "100%",
										borderRadius: "2.5px",
										background: levelColor(day.contributionCount),
									}}
								/>
							))}
						</div>
					))}
				</div>
			</div>

			{/* avatar + name + bio */}
			<a
				href="/github"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					padding: "12px 12px 8px",
					display: "flex",
					gap: "10px",
					alignItems: "flex-start",
				}}
			>
				<img
					src={avatarUrl}
					alt={username}
					style={{
						width: "36px",
						height: "36px",
						borderRadius: "50%",
						flexShrink: 0,
						display: "block",
					}}
				/>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "2px",
						minWidth: 0,
					}}
				>
					<span
						style={{
							fontSize: "11px",
							fontWeight: "bold",
							color: "#0f172a",
							letterSpacing: "0.03em",
							lineHeight: 1.2,
							display: "block",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{displayName}
					</span>
					<span
						style={{
							fontSize: "10px",
							color: "#64748b",
							lineHeight: 1.2,
							display: "block",
						}}
					>
						{username}
					</span>
					<span
						style={{
							fontSize: "9px",
							color: "#64748b",
							lineHeight: 1.4,
							marginTop: "2px",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{bio}
					</span>
				</div>
			</a>
		</div>
	);
};

function levelColor(count: number): string {
	if (count === 0) return "#e0e3e8";
	if (count <= 2) return "#9be9a8";
	if (count <= 5) return "#40c463";
	if (count <= 10) return "#30a14e";
	return "#216e39";
}

function getMonthLabels(): string[] {
	const MONTHS = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	return [0, 4, 8, 12].map((i) => {
		const d = new Date();
		d.setDate(d.getDate() - (15 - i) * 7);
		return MONTHS[d.getMonth()];
	});
}
