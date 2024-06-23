"use client"

import { useEffect } from "react";

// @ts-ignore
import * as UnicornStudio from "@/helpers/unicornStudio.umd.js";

export const Background = (props: any) => {
	const isAscii = false;

	useEffect(() => {
		UnicornStudio.init()
			.then((scenes) => {
				console.log({ scenes });
			})
			.catch((error) => {
				console.error({ error });
			});
	}, []);

	return (
		<>
			{!isAscii && (
				<div
					id='gl-bg'
					className={props.className}
					style={{ ...props.style }}
					data-us-project-src='/us.json'
					data-us-scale='1'
					data-us-dpi='1.5'
					data-us-disablemobile='true'
				></div>
			)}

			{isAscii && (
				<div
					id='gl-ascii'
					className={props.className}
					style={{ ...props.style }}
					data-us-project-src='/ascii.json'
					data-us-scale='1'
					data-us-dpi='1.5'
					data-us-disablemobile='true'
				></div>
			)}
		</>
	);
};
