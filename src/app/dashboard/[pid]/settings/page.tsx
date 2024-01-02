import Settings from "@/components/Settings"

interface PageParams {
	params: {
		pid: string
	}
}
const Page = async ({ params }: PageParams) => {
	return <Settings projectId={params.pid} />
}

export default Page
