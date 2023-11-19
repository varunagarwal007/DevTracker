"use client"
import { trpc } from "@/app/_trpc/client"
import { cn } from "@/lib/utils"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import {
	Calendar,
	ChevronsUpDown,
	Clipboard,
	Code2,
	GanttChart,
	Home,
	Newspaper,
	PlusSquare,
	Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible"
import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"
import { ReactElement, ReactNode, useState } from "react"
import { Switch } from "../ui/switch"
import { useTheme } from "next-themes"
import { Label } from "../ui/label"

interface ProjectPageWrapper {
	projectId: string
	children: ReactNode
}

const ProjectLandingPage = (props: ProjectPageWrapper) => {
	const { projectId } = props
	const { user } = useKindeBrowserClient()
	const pathName = usePathname()
	const { data, isLoading } = trpc.project.getProjectDetail.useQuery({
		id: projectId,
	})

	const [isPlanningOpen, setIsPlanningOpen] = useState<boolean>(false)
	const [isDevOpen, setIsDevOpen] = useState<boolean>(false)
	const { setTheme, theme } = useTheme()

	if (isLoading || !data) {
		return <Skeleton />
	}

	return (
		<div className="m-5 ">
			<div className="flex h-[85vh]">
				<aside className="hidden md:block md:w-[8rem] lg:w-[16rem]">
					<div className="flex-col my-8">
						<div className="my-4 flex items-center">
							<div className="w-1/4 ml-3">
								<Avatar className="w-9 h-9 aspect-square">
									<AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?randomizeIds=true" />
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
								open={
									(pathName.includes("timeline") ||
										pathName.includes("board")) &&
									isPlanningOpen
								}
								onOpenChange={() => setIsPlanningOpen((f) => !f)}
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
										href={`/dashboard/${projectId}/timeline`}
										className={cn(
											"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
											{
												"border border-sm border-primary-foreground text-primary bg-red-100":
													pathName === `/dashboard/${projectId}/timeline`,
											}
										)}
									>
										<GanttChart className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs ">Timeline</span>
									</Link>
									<Link
										href={`/dashboard/${projectId}/addview`}
										className={cn(
											"rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100",
											{
												"border border-sm border-primary-foreground text-primary bg-red-100":
													pathName === `/dashboard/board/${projectId}/addview`,
											}
										)}
									>
										<PlusSquare className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs ">Add view</span>
									</Link>
								</CollapsibleContent>
							</Collapsible>
							<Collapsible
								className="w-full space-y-2"
								open={pathName.includes("code") || isDevOpen}
								onOpenChange={() => setIsDevOpen((f) => !f)}
							>
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
									<div className="rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100">
										<Code2 className="h-5 w-5 mx-2 " />
										<span className="font-medium text-xs text-initi">Code</span>
									</div>
								</CollapsibleContent>
							</Collapsible>
						</div>
						<Separator />
						<div className="my-4 space-y-2">
							<div className="rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100">
								<Newspaper className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs">Document</span>
							</div>
							<div className="rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100">
								<Calendar className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs">Calender</span>
							</div>
							<div className="rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100">
								<Settings className="h-5 w-5 mx-2 " />
								<span className="font-medium text-xs ">Settings</span>
							</div>
							<div className="rounded-md px-4 py-3 flex items-center space-x-2 w-full text-muted-foreground cursor-pointer hover:text-primary hover:bg-red-100">
								<Switch
									id="airplane-mode"
									onClick={() => setTheme(theme === "light" ? "dark" : "light")}
								/>
								<Label htmlFor="airplane-mode">Toggle Theme</Label>
							</div>
						</div>
					</div>
				</aside>
				<Separator orientation="vertical" className="mx-2 w-[3px] " />

				<main className="flex-1 h-full">
					<div className="m-8">{props.children}</div>
				</main>
			</div>
		</div>
	)
}

export default ProjectLandingPage
