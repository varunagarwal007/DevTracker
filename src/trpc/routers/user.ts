import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import db from "@/db"
import { TRPCError } from "@trpc/server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server"

export const userRouters = router({
	getUserProjects: privateProcedure.query(async () => {
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
})
