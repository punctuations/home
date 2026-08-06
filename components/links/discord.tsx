"use client";

import { usePresence } from "@/components/LanyardContext";

type Status = "online" | "idle" | "dnd" | "offline";

export interface DiscordProps {
	displayName: string;
	username: string;
	avatarUrl: string;
	bannerUrl: string | null;
	avg: string;
	listening?: string;
	status: Status;
}

export const Discord: React.FC<DiscordProps> = ({
	displayName,
	username,
	avatarUrl,
	bannerUrl,
	avg,
	listening,
	status,
}) => {
	const ws = usePresence();

	return (
		<div
			style={{
				width: "240px",
				borderRadius: "8px",
				boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.12)",
				fontFamily: "monospace",
				overflow: "hidden",
			}}
			className="reciept"
		>
			{/* header */}
			{bannerUrl ? (
				<div
					style={{
						height: "64px",
						backgroundImage: `url(${bannerUrl})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						marginLeft: "8px",
						marginTop: "8px",
						marginRight: "8px",
						borderRadius: "6px",
					}}
				/>
			) : (
				<div
					style={{
						height: "64px",
						backgroundColor: avg,
						marginLeft: "8px",
						marginTop: "8px",
						marginRight: "8px",
						borderRadius: "6px",
					}}
				/>
			)}

			{/* avatar + info */}
			<a
				href="/discord"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					padding: "12px",
					display: "flex",
					gap: "10px",
				}}
			>
				<div style={{ position: "relative", width: "36px", height: "36px" }}>
					<img
						src={avatarUrl}
						alt={username}
						style={{
							width: "36px",
							height: "36px",
							borderRadius: "50%",
							flexShrink: 0,
						}}
					/>
					<div
						style={{
							position: "absolute",
							bottom: "0px",
							right: "0px",
							width: "10px",
							height: "10px",
							borderRadius: "50%",
							background: statusColor(ws ? ws.discord_status : status),
							border: "2px solid white",
						}}
					/>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						minWidth: 0,
					}}
				>
					<span
						style={{
							fontSize: "11px",
							fontWeight: "bold",
							color: "#0f172a",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{displayName}{" "}
						{(ws ? ws.listening_to_spotify : listening) && (
							<span
								style={{
									fontWeight: "normal",
									fontSize: "10px",
									color: "#64748b",
								}}
							>
								@{username}
							</span>
						)}
					</span>

					{(ws ? !ws.listening_to_spotify : !listening) && (
						<span
							style={{
								fontSize: "10px",
								color: "#64748b",
							}}
						>
							@{username}
						</span>
					)}

					{(ws ? ws.listening_to_spotify : listening) && (
						<span
							style={{
								fontSize: "9px",
								color: "#64748b",
								lineBreak: "loose",
								lineHeight: 1.4,
								marginTop: "2px",
								// display: "-webkit-box",
								// WebkitLineClamp: 2,
								// WebkitBoxOrient: "vertical",
								overflow: "hidden",
								display: "flex",
								alignItems: "center",
							}}
						>
							<svg
								style={{ verticalAlign: "middle", marginRight: "4px" }}
								width="9"
								height="9"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2 16H0V8H2V16ZM6 6H12V8H10V10H12V12H10V14H16V16H4V0H6V6Z"
									fill="#64748b"
								/>
							</svg>{" "}
							<span
								style={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								Listening to {ws ? ws.spotify?.artist : listening}
							</span>
						</span>
					)}
				</div>
			</a>
		</div>
	);
};

function statusColor(status: Status): string {
	return {
		online: "#23a55a",
		idle: "#f0b232",
		dnd: "#f23f43",
		offline: "#80848e",
	}[status];
}
