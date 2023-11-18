import Board from "@/components/Project/Board"
import Overview from "@/components/Project/Overview"
import db from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server"
import { notFound, redirect } from "next/navigation"
interface PageParams {
	params: {
		pid: string
	}
}
const Page = async ({ params }: PageParams) => {
	const { pid } = params

	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${pid}`)

	const project = await db.project.findFirst({
		where: {
			id: pid,
			userId: user.id,
		},
	})

	if (!project) notFound()
	return <Board projectId={pid} />
}

export default Page
