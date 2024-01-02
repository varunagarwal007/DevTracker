"use client"

import { trpc } from "@/app/_trpc/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import Chart from "react-apexcharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const Overview = ({ projectId }: { projectId: string }) => {
	const { data: projectStats, isLoading } =
		trpc.project.getProjectStats.useQuery(
			{ id: projectId },
			{ staleTime: 3 * 60 * 1000 }
		)
	if (isLoading) return <h1>Loading...</h1>
	if (!projectStats) notFound()
	const series = [...projectStats?.issueCounts.map((i) => i._count.status)]
	const labels = [...projectStats?.issueCounts.map((i) => i.status)]

	return (
		<div className="w-full h-full">
			<div className="m-4 rounded-lg py-4">
				<div className="grid grid-cols-2 gap-2 md:gap-4">
					<div className="h-fit rounded-xl border border-primary">
						<Chart
							series={series}
							options={{
								labels: labels,
								legend: { position: "bottom" },
								chart: {
									height: 200,
								},
							}}
							type="pie"
						/>
					</div>
					<div className="min-h-96 rounded-xl border border-primary space-y-4 p-4">
						<div className="text-primary text-lg">
							Top Priority Issues of this Project.
						</div>
						{projectStats.topIssues.map((i) => (
							<div className="w-full  h-16 bg-muted rounded-md p-2 flex flex-row items-center">
								<div className="flex flex-col">
									<span>TASK-{i.task_number}</span>{" "}
									<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground h-fit">
										{i.labels ?? "Bug"}
									</div>
								</div>

								<div className="mx-4 font-medium truncate">{i.title} </div>
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-row gap-x-4 my-8">
					<Link href={`/dashboard/${projectId}/listview`}>
						<Card>
							<CardHeader>
								<CardTitle className="text-primary">Task List View </CardTitle>{" "}
							</CardHeader>
							<CardContent>
								This where all your task are in List view
							</CardContent>
						</Card>
					</Link>
					<Link href={`/dashboard/${projectId}/board`}>
						<Card>
							<CardHeader>
								<CardTitle className="text-primary">Kanban View </CardTitle>{" "}
							</CardHeader>
							<CardContent>Drag and Drop your Task Items here.</CardContent>
						</Card>
					</Link>
					<Link href={`/dashboard/${projectId}/playground`}>
						<Card>
							<CardHeader>
								<CardTitle className="text-primary">Playground </CardTitle>{" "}
							</CardHeader>
							<CardContent>Want a whiteboard to plan? Click Here</CardContent>
						</Card>
					</Link>
					<Link href={`/dashboard/${projectId}/calendar`}>
						<Card>
							<CardHeader>
								<CardTitle className="text-primary">Calendar </CardTitle>{" "}
							</CardHeader>
							<CardContent>Manage your schedule here.</CardContent>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Overview
