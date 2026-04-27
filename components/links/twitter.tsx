"use client";

interface TwitterProps {
	username?: string;
	displayName?: string;
	bio?: string;
	avatarUrl?: string;
	headerUrl?: string;
}

export const Twitter: React.FC<TwitterProps> = ({
	username = "0xA5A5",
	displayName = "matt",
	bio = "somewhat of a software dev, ubc cs '27",
	avatarUrl = "https://pbs.twimg.com/profile_images/2029463293635772421/3fZPkyDK_200x200.jpg",
	headerUrl = "https://pbs.twimg.com/profile_banners/1210823653027303424/1710105556/600x200",
}) => {
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
			{headerUrl && (
				<div
					style={{
						height: "64px",
						backgroundImage: `url(${headerUrl})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						marginLeft: "8px",
						marginTop: "8px",
						marginRight: "8px",
						borderRadius: "6px",
					}}
				/>
			)}

			{/* avatar + info */}
			<div
				style={{
					padding: "12px",
					display: "flex",
					gap: "10px",
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
					}}
				/>

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
						<span
							style={{
								fontSize: "10px",
								color: "#64748b",
							}}
						>
							@{username}
						</span>
					</span>

					<span
						style={{
							fontSize: "9px",
							color: "#64748b",
							lineBreak: "loose",
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
			</div>
		</div>
	);
};
