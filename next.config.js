/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
		],
	},
	reactStrictMode: false,
	swcMinify: false,
}

module.exports = nextConfig
