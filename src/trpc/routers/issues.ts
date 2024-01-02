import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import db from "@/db"
import { observable } from "@trpc/server/observable"
import { type Issues } from "@prisma/client"
import { EventEmitter } from "stream"

const emitter = new EventEmitter()

export const issueRouters = router({
	createIssue: privateProcedure
		.input(
			z.object({
				projectId: z.string(),
				title: z.string(),
				description: z.string(),
				issue_type: z.enum(["BUG", "STORY", "TASK", "SUBTASK"]),
				original_estimate: z.number(),
				due_date: z.coerce.date(),
				priority: z.number(),
				label: z.enum([
					"Design",
					"Development",
					"DevOps",
					"Frontend",
					"Backend",
					"Documentation",
					"Feature",
				]),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { getUser } = getKindeServerSession()
			const user = await getUser()
			if (!user || !user.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const res = await db.issues
				.create({
					data: {
						title: input.title,
						description: input.description,
						projectId: input.projectId,
						createdById: ctx.userId,
						type: input.issue_type,
						status: "NEW",
						due_date: input.due_date,
						priority: input.priority,
					},
				})
				.then((response) => response)
				.catch((error) => console.log(error))
			return res
		}),
	getIssuesByProject: privateProcedure
		.input(z.object({ project_id: z.string() }))
		.query(async ({ ctx, input }) => {
			const res = await db.issues.findMany({
				where: { projectId: input.project_id },
				select: {
					title: true,
					description: true,
					due_date: true,
					id: true,
					priority: true,
					type: true,
					status: true,
					assignedTo: true,
					labels: true,
					task_number: true,
				},
			})
			const issueStatus = ["NEW", "ACTIVE", "RESOLVED", "CLOSED"]
			const tableData = [
				...issueStatus.map((i) => ({
					title: i,
					key: i.toLowerCase(),
					items: res.filter((a) => a.status === i),
				})),
			]
			if (!res) throw new TRPCError({ code: "NOT_FOUND" })
			return tableData
		}),
	updateIssueStatus: privateProcedure
		.input(
			z.object({
				issue_id: z.string(),
				issue_status: z.enum(["NEW", "ACTIVE", "RESOLVED", "CLOSED"]),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const res = await db.issues.update({
				where: {
					id: input.issue_id,
				},
				data: {
					status: input.issue_status,
					assignedTo: {
						connect: {
							id: ctx.userId,
						},
					},
				},
			})
			return res
		}),

	getIssuesList: privateProcedure
		.input(z.object({ project_id: z.string() }))
		.query(async ({ ctx, input }) => {
			const res = await db.issues.findMany({
				where: { projectId: input.project_id },
				select: {
					title: true,
					description: true,
					due_date: true,
					id: true,
					priority: true,
					type: true,
					status: true,
					assignedTo: true,
					labels: true,
					task_number: true,
				},
			})

			if (!res) throw new TRPCError({ code: "NOT_FOUND" })
			return res
		}),
})
