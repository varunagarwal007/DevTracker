/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/sign-in",
				destination: "/api/auth/login",
				permanent: true,
			},
			{
				source: "/sign-up",
				destination: "/api/auth/login",
				permanent: true,
			},
		]
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.resolve.alias.canvas = false
		config.resolve.alias.encoding = false
		return config
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: { domains: ["api.dicebear.com"] },
}

module.exports = nextConfig
