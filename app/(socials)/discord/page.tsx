'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { Metadata } from 'next';

const metadata: Metadata = {
	title: 'Discord',
};

export default function Discord() {
	useEffect(() => {
		window.location.href = 'https://discord.gg/R3QtA68Cbf';
	}, []);
	return (
		<>
			<Head>
				<link rel='icon' href='https://github.com/punctuations.png' />
				<meta name='theme-color' content='#2f3136' />
			</Head>

			<div>
				<a href={'https://discord.gg/R3QtA68Cbf'}>Redirecting...</a>
			</div>
		</>
	);
}
