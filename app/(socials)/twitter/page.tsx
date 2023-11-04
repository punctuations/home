'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { Metadata } from 'next';

const metadata: Metadata = {
	title: 'Twitter',
};

export default function Twitter() {
	useEffect(() => {
		window.location.href = 'https://twitter.com/mttskbl';
	}, []);
	return (
		<>
			<Head>
				<link rel='icon' href='https://github.com/punctuations.png' />
				<meta name='theme-color' content='#2f3136' />
			</Head>

			<div>
				<a href={'https://twitter.com/mttskbl'}>Redirecting...</a>
			</div>
		</>
	);
}
