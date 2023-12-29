"use client"
import React from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import CreateNewIssueForm from "../Board/Task/NewTaskForm"
import { trpc } from "@/app/_trpc/client"
import { CheckCircle, Loader2, PlusCircle, Timer, XCircle } from "lucide-react"
import { notFound } from "next/navigation"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

const ListView = ({ projectId }: { projectId: string }) => {
	const { data, isLoading, isError, refetch } =
		trpc.issue.getIssuesList.useQuery(
			{
				project_id: projectId,
			},
			{ staleTime: 5 * 1000 }
		)

	if (isLoading)
		return (
			<div className="w-full h-full grid place-items-center text-4xl">
				<Loader2 className="w-10 h-10 space-x-2 animate-spin" /> Loading...
			</div>
		)
	if (!data) return notFound()
	console.log(data)
	function returnTaskStatus(status: string) {
		if (status === "NEW") {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<PlusCircle className="w-5 h-5 text-primary" /> <span>NEW</span>
				</div>
			)
		} else if (status === "ACTIVE") {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<Timer className="w-5 h-5 text-primary" />
					<span>ACTIVE</span>
				</div>
			)
		} else if (status === "RESOLVED") {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<CheckCircle className="w-5 h-5 text-primary" /> <span>RESOLVED</span>
				</div>
			)
		} else {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<XCircle className="w-5 h-5 text-primary" /> <span>CLOSED</span>
				</div>
			)
		}
	}
	return (
		<div className="w-full h-full">
			<div className="py-2 h-20 w-full">
				<h3 className="text-2xl font-bold text-primary">Welcome back!</h3>
				<p className="text-muted-foreground">
					Here is the List view for your project.
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
			<div className="rounded-md border-2">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Task</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Priority</TableHead>
						</TableRow>
					</TableHeader>
					{data.map((i, index) => (
						<TableRow key={i.id}>
							<TableCell>TASK-{index} </TableCell>
							<TableCell>
								<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
									Feature
								</div>{" "}
								<span className="font-medium">{i.title} </span>
							</TableCell>
							<TableCell>{returnTaskStatus(i.status)}</TableCell>
							<TableCell>{i.priority} </TableCell>
						</TableRow>
					))}
				</Table>
			</div>
		</div>
	)
}

export default ListView
