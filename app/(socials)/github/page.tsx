'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { Metadata } from 'next';

const metadata: Metadata = {
	title: 'GitHub',
};

export default function GitHub() {
	useEffect(() => {
		window.location.href = 'https://github.com/punctuations';
	}, []);
	return (
		<>
			<Head>
				<link rel='icon' href='https://github.com/punctuations.png' />
				<meta name='theme-color' content='#2f3136' />
			</Head>

			<div>
				<a href={'https://github.com/punctuations'}>Redirecting...</a>
			</div>
		</>
	);
}
