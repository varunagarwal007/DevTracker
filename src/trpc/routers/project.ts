import db from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { privateProcedure, router } from "../trpc"

export const projectRouters = router({
	getProjects: privateProcedure.query(async () => {
		const { getUser } = getKindeServerSession()
		const user = await getUser()
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
			const { getUser } = getKindeServerSession()
			const user = await getUser()
			if (!user || !user.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const res = await db.project.create({
				data: {
					title: input.title,
					adminId: ctx.userId,
					projectType: "software",
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
})
