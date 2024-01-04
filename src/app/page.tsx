"use client"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { buttonVariants } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react"
import Link from "next/link"
import React from "react"

const Page = () => {
	const PLANS = [
		{
			name: "Free",
			slug: "free",
			quota: 1,
			pagesPerPdf: 5,
			price: {
				ammount: 0,
				priceIds: {
					test: "",
					production: "",
				},
			},
		},
		{
			name: "Pro",
			slug: "pro",
			quota: 50,
			pagesPerPdf: 25,
			price: {
				ammount: 14,
				priceIds: {
					test: "price_1O7FkxSDb8L26J6zvwNztrmb",
					production: "",
				},
			},
		},
	]

	const pricingItems = [
		{
			plan: "Free",
			tagline: "For small side projects.",
			quota: 1,
			features: [
				{
					text: "1 project per user",
					footnote: "The maximum amount of project user admin can create",
				},
				{
					text: "50 issues/tasks limit",
					footnote: "The maximum issues/tasks per project",
				},
				{
					text: "Mobile-friendly interface",
				},
				{
					text: "Higher-quality responses",
					footnote: "Better algorithmic responses for enhanced content quality",
					negative: true,
				},
				{
					text: "Priority support",
					negative: true,
				},
			],
		},
		{
			plan: "Pro",
			tagline: "For larger projects with higher needs.",
			quota: PLANS.find((p) => p.slug === "pro")!.quota,
			features: [
				{
					text: "5 projects per user",
					footnote: "The maximum amount of project user admin can create",
				},
				{
					text: "150 issues/tasks limit",
					footnote: "The maximum issues/tasks per project",
				},
				{
					text: "Mobile-friendly interface",
				},
				{
					text: "Higher-quality responses",
					footnote: "Better algorithmic responses for enhanced content quality",
				},
				{
					text: "Priority support",
				},
			],
		},
	]
	return (
		<MaxWidthWrapper className="mb-12 mt-8 sm:mt-20 flex flex-col items-center justify-center text-center">
			<div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
				<p className="text-sm font-semibold text-gray-700 cursor-pointer">
					DevTracker is now public!
				</p>
			</div>
			<div className="flex flex-row w-full justify-between">
				<span className="text-5xl font-bold text-left h-full flex-1 flex flex-col gap-y-4">
					<span> Leave no dev behind </span> <span>Collaborate,</span>{" "}
					<span>Communicate,</span> <span>Conquer with</span>
					<span className="text-primary">DevTracker</span>
				</span>
				<span className="flex flex-col space-y-2 text-2xl font-semibold text-left ml-24 flex-1 gap-4">
					<span>📅 Task Scheduling</span>
					<span>📈 Progress Tracking</span>
					<span>🚀 Collaboration Tools</span>
					<span>📉 Performance Analytics</span>
					<span>🔄 Agile Project Management</span>
					<span>🌐 Global Accessibility</span>
				</span>
			</div>
			<div className="mx-auto mt-28 mb-10 sm:max-w-lg">
				<h1 className="text-6xl font-bold sm:text-4xl">Pricing</h1>
				<p className="mt-5 text-gray-600 sm:text-lg">
					Whether you&apos;re just trying out our service or need more,
					we&apos;ve got you covered.
				</p>
			</div>
			<div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
				<TooltipProvider>
					{pricingItems.map(({ plan, tagline, quota, features }, index) => {
						const price =
							PLANS.find((p) => p.slug === plan.toLowerCase())?.price.ammount ||
							0
						return (
							<div
								key={plan}
								className={cn("relative rounded-2xl bg-white shadow-lg", {
									"border-2 border-red-600 shadow-red-200": plan === "pro",
									"border border-gray-200": plan !== "pro",
								})}
							>
								{plan === "pro" && (
									<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-red-600 to-rose-200 px-3 py-2 text-sm font-medium text-white">
										Upgrade now
									</div>
								)}
								<div className="p-5">
									<h3 className="my-3 text-center font-display text-3xl font-bold">
										{plan}
									</h3>
									<p className="text-gray-500">{tagline} </p>
									<p className="my-5 font-display text-6xl font-semibold">
										{price}
									</p>
									<p className="text-gray-500">per month</p>
								</div>
								<div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
									<div className="flex items-center space-x-1">
										<p>{quota.toLocaleString()} projects/user</p>
										<Tooltip delayDuration={300}>
											<TooltipTrigger className="cursor-default ml-1.5">
												<HelpCircle className="h-4 w-4 text-zinc-500" />
											</TooltipTrigger>
											<TooltipContent className="w-80 p-2">
												How many projects a user can create.
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
								<ul className="my-10 space-y-5 px-8">
									{features.map(({ text, footnote, negative }, index) => (
										<li key={index} className="flex space-x-5">
											<div className="flex-shrink-0">
												{negative ? (
													<Minus className="h-6 w-6 text-gray-300" />
												) : (
													<Check className="h-6 w-6 text-red-500" />
												)}
											</div>
											{footnote ? (
												<div className="flex items-center space-x-1">
													<p
														className={cn("text-gray-400", {
															"text-gray-600": negative,
														})}
													>
														{text}
													</p>
													<Tooltip delayDuration={300}>
														<TooltipTrigger className="cursor-default ml-1.5">
															<HelpCircle className="h-4 w-4 text-zinc-500" />
														</TooltipTrigger>
														<TooltipContent className="w-80 p-2">
															{footnote}
														</TooltipContent>
													</Tooltip>
												</div>
											) : (
												<p
													className={cn("text-gray-400", {
														"text-gray-600": negative,
													})}
												>
													{text}
												</p>
											)}
										</li>
									))}
								</ul>
								<div className="border-t border-gray-200" />
								<div className="p-5">
									{plan === "Free" ? (
										<Link
											href={"/sign-in"}
											className={buttonVariants({
												className: "w-full",
												variant: "secondary",
											})}
										>
											Sign up now
											<ArrowRight className="h-5 w-5 ml-1.5" />
										</Link>
									) : (
										<Link
											href="/sign-in"
											className={buttonVariants({
												className: "w-full",
											})}
										>
											Sign up now
											<ArrowRight className="h-5 w-5 ml-1.5" />
										</Link>
									)}
								</div>
							</div>
						)
					})}
				</TooltipProvider>
			</div>
			<div className="mt-24 w-full">
				<span className="text-center text-3xl font-bold">
					Upcomming List of Features.
				</span>
				<div className="w-3/4 mx-auto text-left grid grid-cols-2 space-y-2 text-xl font-semibold mt-16">
					<div className="gap-y-4 h-full flex flex-col w-fit">
						<span>➕ Increase no of projects limit per user</span>
						<span>🏢 Have multiple org&apos;s per user</span>
						<span>🚀 Faster user experience</span>
					</div>
					<div className="gap-y-4 h-full flex flex-col">
						<span>📉 Integrating third party VCS</span>
						<span>🔄 Editable work items</span>
						<span>🌐 Adding accessibility support</span>
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	)
}

export default Page
