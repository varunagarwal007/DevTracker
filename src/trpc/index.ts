import { userRouters } from "./routers/user"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server"
import { router } from "./trpc"
import { publicProcedure } from "./trpc"
import { TRPCError } from "@trpc/server"
import db from "@/db"
import { projectRouters } from "./routers/project"
import { getUserAvatar } from "@/lib/functions/functions"

export const appRouter = router({
	authCallback: publicProcedure.query(async () => {
		const { getUser } = getKindeServerSession()
		const user = await getUser()
		if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" })
		//check if the user is in database
		const dbUser = await db.user.findFirst({
			where: {
				id: user.id,
			},
		})

		if (!dbUser) {
			//create user
			await db.user.create({
				data: {
					id: user.id,
					email: user.email,
					avatar: getUserAvatar(),
				},
			})
		}

		return { success: true }
	}),
	user: userRouters,
	project: projectRouters,
})

export type AppRouter = typeof appRouter
