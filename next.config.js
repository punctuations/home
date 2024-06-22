const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

/**
 * A fork of 'next-pwa' that has app directory support
 * @see https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1332258575
 */
const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
	// uncomment the following snippet if using styled components
	// compiler: {
	//   styledComponents: true,
	// },
	reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
	experimental: {
		reactRoot: "concurrent",
	},
	images: {
		domains: ["github.com", "i.scdn.co", "cdn.dont-ping.me", "cdn.discordapp.com"],
	},
	async redirects() {
		return [
			{
				source: "/github",
				destination: "https://github.com/punctuations",
				permanent: true,
			},
			{
				source: "/twitter",
				destination: "https://twitter.com/mttskbl",
				permanent: true,
			},
			{
				source: "/x",
				destination: "https://x.com/mttskbl",
				permanent: true,
			},
			{
				source: "/discord",
				destination: "https://discord.gg/R3QtA68Cbf",
				permanent: true,
			},
		];
	},
	webpack(config, { isServer }) {
		if (!isServer) {
			// We're in the browser build, so we can safely exclude the sharp module
			config.externals.push("sharp");
		}
		// audio support
		config.module.rules.push({
			test: /\.(ogg|mp3|wav|mpe?g)$/i,
			exclude: config.exclude,
			use: [
				{
					loader: require.resolve("url-loader"),
					options: {
						limit: config.inlineImageLimit,
						fallback: require.resolve("file-loader"),
						publicPath: `${config.assetPrefix}/_next/static/images/`,
						outputPath: `${isServer ? "../" : ""}static/images/`,
						name: "[name]-[hash].[ext]",
						esModule: config.esModule || false,
					},
				},
			],
		});

		// shader support
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/,
			exclude: /node_modules/,
			use: ["raw-loader", "glslify-loader"],
		});

		return config;
	},
};

const KEYS_TO_OMIT = [
	"webpackDevMiddleware",
	"configOrigin",
	"target",
	"analyticsId",
	"webpack5",
	"amp",
	"assetPrefix",
];

module.exports = (_phase, { defaultConfig }) => {
	const plugins = [[withPWA], [withBundleAnalyzer, {}]];

	const wConfig = plugins.reduce((acc, [plugin, config]) => plugin({ ...acc, ...config }), {
		...defaultConfig,
		...nextConfig,
	});

	const finalConfig = {};
	Object.keys(wConfig).forEach((key) => {
		if (!KEYS_TO_OMIT.includes(key)) {
			finalConfig[key] = wConfig[key];
		}
	});

	return finalConfig;
};
