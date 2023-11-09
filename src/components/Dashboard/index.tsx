"use client"

import { trpc } from "@/app/_trpc/client"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Loader2, Plus, Send, Settings2 } from "lucide-react"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import Link from "next/link"

const Dashboard = () => {
	const { user } = useKindeBrowserClient()
	const { data, isLoading } = trpc.project.getProjects.useQuery()

	const [projectName, setProjectName] = useState<string>("")

	const { mutate: createProject, isLoading: projectLoader } =
		trpc.project.createProject.useMutation({})

	return (
		<MaxWidthWrapper className="h-full">
			<div className="my-8 h-full flex flex-col space-y-2">
				<div className="flex justify-between mb-5 flex-col md:flex-row md:flex-auto">
					<span className="text-3xl font-medium ">Your Projects</span>
					<div className=" flex border rounded-sm p-2 text-sm  border-amber-500 bg-amber-100">
						<p className="leading-relaxed tracking-wide">
							<span className="font-semibold">Pricing now available! </span>
							<span>Head to the </span>
							<span className="font-semibold">
								Plans & Billings tab in any of your project to upgrade
							</span>
						</p>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button disabled={isLoading}>
								{isLoading ? (
									<Loader2 className="w-5 h-5 space-x-2 animate-spin" />
								) : (
									<Plus className="w-5 h-5 space-x-2" />
								)}
								Create New Project
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Create New Project</DialogTitle>
								<DialogDescription>
									You will be the admin of the Project Created.
								</DialogDescription>
							</DialogHeader>
							<div className="flex items-center space-x-2">
								<div className="grid flex-1 gap-2">
									<Label htmlFor="link" className="sr-only">
										Link
									</Label>
									<Input
										id="link"
										placeholder="Enter a title for the Project Name."
										onChange={(e) => setProjectName(e.target.value)}
									/>
								</div>
								<Button
									className="px-3"
									onClick={() => createProject({ title: projectName })}
								>
									<Send className="w-4 h-4" />
								</Button>
							</div>
							<DialogFooter className="sm:justify-start">
								<DialogClose asChild>
									<Button type="button" variant="secondary">
										Close
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="flex flex-col mt-16 space-y-4">
					<div className=" my-2">
						<span className="font-semibold text-lg">
							{user?.given_name ?? "Your"}&apos;s org
						</span>
					</div>
					<ul
						role="list"
						className="flex w-full flex-wrap items-center justify-center overflow-y-auto md:grid md:grid-cols-2 md:gap-0 lg:grid-cols-3 lg:gap-5"
					>
						{data?.map((item, index) => (
							<li
								className="col-span-1 w-full max-w-sm cursor-pointer"
								key={index}
							>
								<Link href={`/dashboard/${item.id}`}>
									<div className="relative m-2 h-64 overflow-hidden rounded-lg bg-primary-foreground border-2 border-primary border-dashed shadow shadow-secondary flex-col">
										<div className="h-1/2 flex justify-center items-center flex-col space-y-4 border-b">
											Random Image
										</div>
										<div className="flex-col mx-6 py-2">
											<div className="flex justify-end w-full items-center">
												<span className="font-semibold text-lg flex-1 truncate">
													{item.title}
												</span>
												<Settings2 className="w-4 h-4 text-secondary-foreground" />{" "}
											</div>
											<p className="w-2/3 my-4">
												Total Issues: {item.totalIssues ?? 0}
											</p>
											<p className="w-2/3">
												Total Members: {item.totalIssues ?? 0}
											</p>
										</div>
									</div>
								</Link>
							</li>
						))}
						<Dialog>
							<DialogTrigger asChild>
								<li className="col-span-1 w-full max-w-sm cursor-pointer">
									<div className="relative m-2 h-64 flex-col overflow-hidden rounded-lg bg-primary-foreground border-2 border-primary border-dashed shadow shadow-secondary flex justify-center items-center">
										<div className="h-1/2 flex justify-center items-center flex-col space-y-4">
											<span className="text-muted-foreground">
												Create New Project
											</span>
											<Plus className="w-10 h-10 text-muted-foreground" />
										</div>
									</div>
								</li>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Create New Project</DialogTitle>
									<DialogDescription>
										You will be the admin of the Project Created.
									</DialogDescription>
								</DialogHeader>
								<div className="flex items-center space-x-2">
									<div className="grid flex-1 gap-2">
										<Label htmlFor="link" className="sr-only">
											Link
										</Label>
										<Input
											id="link"
											placeholder="Enter a title for the Project Name."
											onChange={(e) => setProjectName(e.target.value)}
										/>
									</div>
									<Button
										className="px-3"
										onClick={() => createProject({ title: projectName })}
										disabled={projectLoader}
									>
										<Send className="w-4 h-4" />
									</Button>
								</div>
								<DialogFooter className="w-full flex justify-center">
									{projectLoader ? (
										<span className="font-semibold text-zinc-500 w-full flex items-center gap-x-3">
											<Loader2 className="w-4 h-4 animate-spin mx-2" /> Creating
											Your Project...
										</span>
									) : null}
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</ul>
				</div>
			</div>
		</MaxWidthWrapper>
	)
}

export default Dashboard
