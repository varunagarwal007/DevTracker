import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server"
import { privateProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { db } from "@/db"
import { z } from "zod"

export const projectRouters = router({
	getProjects: privateProcedure.query(async () => {
		const { getUser } = getKindeServerSession()
		const user = await getUser()
		if (!user || !user.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}

		const userProjects = await db.project.findMany({
			where: {
				userId: user.id,
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
					userId: ctx.userId,
				},
			})
			return res
		}),
})
