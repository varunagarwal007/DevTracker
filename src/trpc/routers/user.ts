import { z } from "zod"
import { middleware, privateProcedure, router } from "../trpc"
import db from "@/db"
import { TRPCError } from "@trpc/server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const userRouters = router({})
