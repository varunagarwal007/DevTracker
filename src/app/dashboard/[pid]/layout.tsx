"use client"
import { trpc } from "@/app/_trpc/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import {
	Calendar,
	ChevronsUpDown,
	Clipboard,
	Code2,
	GanttChart,
	Home,
	Moon,
	Newspaper,
	PlusSquare,
	Settings,
	Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { notFound, usePathname } from "next/navigation"
interface PageParams {
	pid: string
}
export default function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: PageParams
}) {
	const projectId = params.pid
	const { user } = useKindeBrowserClient()
	const pathName = usePathname()

	// if (!user || !user.id)
	// 	redirect(`/auth-callback?origin=dashboard/${projectId}`)

	const { data, isLoading, isError } = trpc.project.getProjectById.useQuery(
		{
			id: projectId,
		},
		{
			staleTime: 5 * 60 * 60 * 1000,
		}
	)

	const { setTheme, theme } = useTheme()

	if (isError) notFound()
	if (isLoading || !data) return <Skeleton />

	return (
		<div className="m-auto max-w-screen-2xl">
			<div className="flex h-auto">
				<aside className="hidden md:block md:w-[8rem] lg:w-[16rem]">
					<div className="flex-col my-8">
						<div className="my-4 flex items-center">
							<div className="w-1/4 ml-3">
								<Avatar className="w-9 h-9 aspect-square">
									<AvatarImage
										src={
											data.picture ||
											"https://api.dicebear.com/7.x/shapes/svg?seed=Chester"
										}
									/>
									<AvatarFallback>User</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex flex-col space-y-1 flex-1">
								<h3 className="text-sm font-semibold">{data.title} </h3>
								<span className="text-xs text-muted-foreground">
									Software Project{" "}
								</span>
							</div>
						</div>
						<div className="my-4">
							<Link
								href={`/dashboard/${projectId}`}
								className={cn(
									"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
									{
										"border border-sm border-primary-foreground text-primary bg-red-100":
											pathName === `/dashboard/${projectId}`,
									}
								)}
							>
								<Home className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs uppercase">Overview</span>
							</Link>
						</div>
						<Separator />
						<div className="my-4">
							<Collapsible
								className="space-y-2 w-full"
								defaultOpen={
									pathName.includes("board") ||
									pathName.includes("listview") ||
									pathName.includes("playground")
								}
							>
								<div className="flex items-center justify-between space-x-4 px-4 w-full group cursor-pointer ">
									<h4 className="text-sm font-semibold text-muted-foreground group-hover:text-primary">
										PLANNING
									</h4>
									<CollapsibleTrigger
										asChild
										className="group-hover:visible invisible"
									>
										<Button variant="ghost" size="sm" className="w-9 p-0">
											<ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Toggle</span>
										</Button>
									</CollapsibleTrigger>
								</div>

								<CollapsibleContent className="space-y-2">
									<Link
										href={`/dashboard/${projectId}/listview`}
										className={cn(
											"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
											{
												"border border-sm border-primary-foreground text-primary bg-red-100":
													pathName === `/dashboard/${projectId}/listview`,
											}
										)}
									>
										<GanttChart className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs ">Task View</span>
									</Link>
									<Link
										href={`/dashboard/${projectId}/board`}
										className={cn(
											"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
											{
												"border border-sm border-primary-foreground text-primary bg-red-100":
													pathName === `/dashboard/${projectId}/board`,
											}
										)}
									>
										<Clipboard className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs ">Board</span>
									</Link>

									<Link
										href={`/dashboard/${projectId}/playground`}
										className={cn(
											"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
											{
												"border border-sm border-primary-foreground text-primary bg-red-100":
													pathName.includes("playground"),
											}
										)}
									>
										<PlusSquare className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs ">Playground</span>
									</Link>
								</CollapsibleContent>
							</Collapsible>
							<Collapsible className="w-full space-y-2" defaultOpen={true}>
								<div className="flex items-center justify-between space-x-4 px-4 w-full group cursor-pointer">
									<h4 className="text-sm font-semibold text-muted-foreground group-hover:text-primary">
										DEVELOPMENT
									</h4>
									<CollapsibleTrigger
										asChild
										className="group-hover:visible invisible"
									>
										<Button variant="ghost" size="sm" className="w-9 p-0">
											<ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Toggle</span>
										</Button>
									</CollapsibleTrigger>
								</div>

								<CollapsibleContent className="space-y-2">
									<Link
										href={`/dashboard/${projectId}/code`}
										className={cn(
											"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
											{
												"border border-sm border-primary-foreground text-primary bg-red-100":
													pathName === `/dashboard/${projectId}/code`,
											}
										)}
									>
										<Code2 className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs ">code</span>
									</Link>
								</CollapsibleContent>
							</Collapsible>
						</div>
						<Separator />
						<div className="my-4 space-y-2">
							<Link
								href={`/dashboard/${projectId}/document`}
								className={cn(
									"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
									{
										"border border-sm border-primary-foreground text-primary bg-red-100":
											pathName === `/dashboard/${projectId}/document`,
									}
								)}
							>
								<Newspaper className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs ">Document</span>
							</Link>

							<Link
								href={`/dashboard/${projectId}/calendar`}
								className={cn(
									"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
									{
										"border border-sm border-primary-foreground text-primary bg-red-100":
											pathName === `/dashboard/${projectId}/calendar`,
									}
								)}
							>
								<Calendar className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs ">Calendar</span>
							</Link>
							<Link
								href={`/dashboard/${projectId}/settings`}
								className={cn(
									"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
									{
										"border border-sm border-primary-foreground text-primary bg-red-100":
											pathName === `/dashboard/${projectId}/settings`,
									}
								)}
							>
								<Settings className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs ">Settings</span>
							</Link>
							<div
								className="rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100"
								onClick={() => {
									theme === "light" ? setTheme("dark") : setTheme("light")
								}}
							>
								{theme === "light" ? (
									<Sun className="h-5 w-5 mx-2 " />
								) : (
									<Moon className="h-5 w-5 mx-2 " />
								)}
								<span className="font-medium text-xs ">Toggle theme</span>
							</div>
						</div>
					</div>
				</aside>
				<Separator orientation="vertical" className="mx-2 w-[3px] " />

				<main className="flex-1 h-full">
					<div className="m-8 h-full">{children}</div>
				</main>
			</div>
		</div>
	)
}
