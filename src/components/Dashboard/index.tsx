"use client"

import { trpc } from "@/app/_trpc/client"
import { Loader2, Plus, Send, Settings2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
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
import { useToast } from "../ui/use-toast"

const Dashboard = () => {
	const router = useRouter()
	const { data, isLoading } = trpc.project.getProjects.useQuery()

	const [projectName, setProjectName] = useState<string>("")
	const { toast } = useToast()

	const { mutate: createProject, isLoading: projectLoader } =
		trpc.project.createProject.useMutation({
			onSuccess: (project) => {
				toast({
					description: "Your Project is created Successfully.",
					variant: "default",
				})
				router.push(`/dashboard/${project.id}`)
			},
		})

	return (
		<MaxWidthWrapper className="h-full">
			<div className="my-8 h-full flex flex-col space-y-2">
				<div className="flex justify-between mb-5 flex-col md:flex-row md:flex-auto">
					<span className="text-3xl font-medium ">Your Projects</span>
					<div className=" flex border rounded-sm p-2 text-sm border-primary border-dashed bg-accent">
						<p className="leading-relaxed tracking-wide">
							<span className="font-semibold">Pricing now available! </span>
							<span>Head to the </span>
							<span className="font-semibold">Upgrade tab to upgrade.</span>
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
							{data && data?.length === 0 ? (
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
							) : (
								<div className="flex flex-col">
									<h1>
										Your Plan currently supports only one project per admin.
									</h1>
									<p>
										Head over to Upgrade tab to upgrade to create more projects.
									</p>
								</div>
							)}
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
				</div>
				<div className="flex flex-col mt-16 space-y-4">
					<div className=" my-2">
						<span className="font-semibold text-lg">Your org</span>
					</div>
					{!isLoading ? (
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
										<div className="relative m-2 h-64 overflow-hidden rounded-lg bg-accent border-2 border-primary border-dashed shadow shadow-secondary flex-col">
											<div className="h-1/2 flex justify-center items-center flex-col space-y-4 border-b overflow-hidden ">
												<Image
													width={100}
													height={100}
													alt="filler"
													src={
														item.picture ||
														"https://api.dicebear.com/7.x/shapes/svg?seed=Chester"
													}
													className="w-full"
												/>
											</div>
											<div className="flex-col mx-6 py-2">
												<div className="flex justify-end w-full items-center">
													<span className="font-semibold text-lg flex-1 truncate">
														{item.title}
													</span>
													<span
														onClick={() =>
															redirect(`/dashboard/${item.id}/settings`)
														}
													>
														<Settings2 className="w-4 h-4 text-secondary-foreground" />
													</span>
												</div>
												<p className="my-4 text-muted-foreground">
													Created At {new Date(item.createdAt).toDateString()}
												</p>
											</div>
										</div>
									</Link>
								</li>
							))}
							<Dialog>
								<DialogTrigger asChild>
									<li className="col-span-1 w-full max-w-sm cursor-pointer">
										<div className="relative m-2 h-64 flex-col overflow-hidden rounded-lg bg-accent border-2 border-primary border-dashed shadow shadow-secondary flex justify-center items-center">
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
									{data && data.length === 0 ? (
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
									) : (
										<div className="flex flex-col">
											<h1>
												Your Plan currently supports only one project per admin.
											</h1>
											<p>
												Head over to Upgrade tab to upgrade to create more
												projects.
											</p>
										</div>
									)}
									<DialogFooter className="w-full flex justify-center">
										{projectLoader ? (
											<span className="font-semibold text-zinc-500 w-full flex items-center gap-x-3">
												<Loader2 className="w-4 h-4 animate-spin mx-2" />{" "}
												Creating Your Project...
											</span>
										) : null}
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</ul>
					) : (
						<div className="flex justify-around items-center">
							<span>Fetching your projects...</span>
							<Loader2 className="w-4 h-4 animate-spin" />{" "}
						</div>
					)}
				</div>
			</div>
		</MaxWidthWrapper>
	)
}
export default Dashboard
