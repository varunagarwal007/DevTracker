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
	typescript: {
		ignoreBuildErrors: true,
	},
	images: { domains: ["api.dicebear.com"], dangerouslyAllowSVG: true },
}

module.exports = nextConfig
