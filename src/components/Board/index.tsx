"use client"
import { trpc } from "@/app/_trpc/client"
import { Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import KanBanTable from "./Table"
import CreateNewIssueForm from "./Task/NewTaskForm"

const Board = ({ projectId }: { projectId: string }) => {
	const [search, setSearch] = useState<string>("")
	const { data, isLoading, isError, refetch } =
		trpc.issue.getIssuesByProject.useQuery(
			{
				project_id: projectId,
			},
			{ staleTime: 5 * 1000 }
		)

	if (isLoading) {
		return (
			<div className="w-full h-full flex place-items-center text-4xl">
				<Loader2 className="w-10 h-10 space-x-2 animate-spin" /> Loading...
			</div>
		)
	}
	if (!data) return notFound()

	return (
		<div className="w-full h-full">
			<div className="py-2 h-20 w-full">
				<h3 className="text-2xl font-bold text-primary">Welcome back!</h3>
				<p className="text-muted-foreground">
					Here is the KanBan Board view for your project.
				</p>
			</div>
			<div className="h-20 w-full flex">
				<Input
					placeholder="Search for issues"
					className=""
					onChange={(e) => setSearch(e.target.value)}
				/>
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
			<KanBanTable tableData={data} refetch={refetch} search={search} />
		</div>
	)
}

export default Board
