"use client"
import { trpc } from "@/app/_trpc/client"
import { notFound, usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import KanBanTable from "./Table"
import CreateNewIssueForm from "./Task/NewTaskForm"

const Board = ({ projectId }: { projectId: string }) => {
	const { data, isLoading, isError, refetch } =
		trpc.issue.getIssuesByProject.useQuery({
			project_id: projectId,
		})

	if (isLoading) return <h1>LOading...</h1>
	if (!data) return notFound()
	console.log(data)

	return (
		<div className="w-full h-full">
			<div className="py-2 h-20 w-full">
				<h3 className="text-2xl font-bold text-primary">Welcome back!</h3>
				<p className="text-muted-foreground">
					Here is the KanBan Board view for your project.
				</p>
			</div>
			<div className="h-20 w-full flex">
				<Input placeholder="Search for issues" className="" />
				<Button variant={"link"}>Only My Issues</Button>
				<Button variant={"link"} disabled>
					Clear all filters
				</Button>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="justify-self-end">Create New Issues</Button>
					</DialogTrigger>
					<DialogContent>
						<CreateNewIssueForm projectId={projectId} refetch={refetch} />
					</DialogContent>
				</Dialog>
			</div>
			{/* Kanban Table */}
			{/* @ts-ignore */}
			<KanBanTable tableData={data} />
		</div>
	)
}

export default Board
