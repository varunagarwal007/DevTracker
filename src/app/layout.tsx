import NavBar from "@/components/NavBar"
import Providers from "@/components/Providers"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "DevTracker",
	description: "Manage all your projects with DevTracker",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<Providers>
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						disableTransitionOnChange
					>
						<NavBar />
						{children}
						<Toaster />
					</ThemeProvider>
				</body>
			</Providers>
		</html>
	)
}
