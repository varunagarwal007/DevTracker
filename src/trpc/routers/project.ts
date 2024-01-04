import db from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { getProjectPicture } from "@/lib/functions/functions"

export const projectRouters = router({
	getProjects: privateProcedure.query(async () => {
		const { getUser } = getKindeServerSession()
		const user = getUser()
		if (!user || !user.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}

		const userProjects = await db.project.findMany({
			where: {
				OR: [{ adminId: user.id }, { teamMembers: { some: { id: user.id } } }],
			},
		})
		return userProjects
	}),
	createProject: privateProcedure
		.input(z.object({ title: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const res = await db.project.create({
				data: {
					title: input.title,
					adminId: ctx.user.id!,
					projectType: "software",
					picture: getProjectPicture(),
				},
			})
			return res
		}),
	getProjectById: privateProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const data = await db.project.findFirst({
				where: {
					id: input.id,
				},
			})
			if (!data) throw new TRPCError({ code: "NOT_FOUND" })
			return data
		}),
	getProjectStats: privateProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const topIssues = await db.issues.findMany({
				where: {
					projectId: input.id,
					priority: {
						lte: 2,
					},
				},
				orderBy: [
					{
						priority: "asc",
					},
					{ due_date: "asc" },
				],
				take: 5,
			})

			const issueCounts = await db.issues.groupBy({
				by: ["status"],
				_count: {
					status: true,
				},
			})
			return { topIssues, issueCounts }
		}),
	getProjectSettings: privateProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return await db.project.findUnique({
				where: {
					id: input.id,
				},
				include: {
					teamMembers: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
							// Select other fields as needed
						},
					},
				},
			})
		}),

	addUserToProject: privateProcedure
		.input(z.object({ email: z.string(), project_id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const newUser = await db.user.findUniqueOrThrow({
				where: {
					email: input.email,
				},
			})
			if (!newUser) throw new TRPCError({ code: "NOT_FOUND" })
			await db.project.update({
				where: {
					id: input.project_id,
				},
				data: {
					teamMembers: {
						connect: {
							id: newUser.id,
						},
					},
				},
			})
			return { error: false }
		}),
	deleteProject: privateProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const deletedIssues = await db.issues.deleteMany({
				where: {
					projectId: input.id,
				},
			})
			const res = await db.project.delete({
				where: {
					id: input.id,
				},
			})
			return res
		}),
})
