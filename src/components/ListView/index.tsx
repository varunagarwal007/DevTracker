"use client"
import React, { useMemo, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import CreateNewIssueForm from "../Board/Task/NewTaskForm"
import { trpc } from "@/app/_trpc/client"
import {
	Activity,
	ArrowBigDownDash,
	CheckCircle,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	ChevronsDown,
	ChevronsUp,
	Loader2,
	MoveUp,
	PlusCircle,
	ShieldAlert,
	Timer,
	XCircle,
} from "lucide-react"
import { notFound } from "next/navigation"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

const ListView = ({ projectId }: { projectId: string }) => {
	const [filterInput, setFilterInput] = useState<string>("")

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
	function getPriorityLabel(p: number | null) {
		if (p === 1) {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<ShieldAlert className="w-5 h-5 text-primary" /> <span>CRITICAL</span>
				</div>
			)
		} else if (p === 2) {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<MoveUp className="w-5 h-5 text-primary" />
					<span>HIGH</span>
				</div>
			)
		} else if (p === 3) {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<ChevronRight className="w-5 h-5 text-primary" /> <span>MEDIUM</span>
				</div>
			)
		} else if (p === 4) {
			return (
				<div className="w-[100px] flex flex-row items-center gap-3">
					<ChevronDown className="w-5 h-5 text-primary" /> <span>LOW</span>
				</div>
			)
		} else {
			return (
				<div className="w-[150px] flex flex-row items-center gap-3">
					<Activity className="w-5 h-5 text-primary" /> <span>NONCRITICAL</span>
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
				<Input
					placeholder="Search for issues"
					className=""
					onChange={(d) => setFilterInput(d.target.value)}
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
			{data.length !== 0 ? (
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
						{data
							.filter((i) =>
								i.title.toLowerCase().includes(filterInput.toLowerCase())
							)
							.map((i, index) => (
								<TableRow key={i.id}>
									<TableCell>TASK-{i.task_number} </TableCell>
									<TableCell>
										<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
											{i.labels ?? "Bug"}
										</div>{" "}
										<span className="font-medium">{i.title} </span>
									</TableCell>
									<TableCell>{returnTaskStatus(i.status)}</TableCell>
									<TableCell>{getPriorityLabel(i.priority)} </TableCell>
								</TableRow>
							))}
					</Table>
				</div>
			) : (
				<div className="w-full h-full grid place-content-center">
					No task with the title &quot; ${filterInput} &quot;
				</div>
			)}
		</div>
	)
}

export default ListView
