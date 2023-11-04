import { Twitter, GitHub, Mail, MessageCircle } from 'react-feather';

export const Socials = [
	<a key='twitter' title='twitter' href={'/twitter'} target='_blank' rel='noopener noreferrer'>
		<Twitter className='hover:opacity-40 duration-500 transition-opacity text-white' />
	</a>,
	<a key='discord' title='discord' href={'/discord'} target='_blank' rel='noopener noreferrer'>
		<MessageCircle className='hover:opacity-40 duration-500 transition-opacity text-white' />
	</a>,
	<a key='github' title='github' href={'/github'} target='_blank' rel='noopener noreferrer'>
		<GitHub className='hover:opacity-40 duration-500 transition-opacity text-white' />
	</a>,
	<a key='email' title='email' href='mailto:matt@dont-ping.me' target='_blank' rel='noopener noreferrer'>
		<Mail className='hover:opacity-40 duration-500 transition-opacity text-white' />
	</a>,
];
