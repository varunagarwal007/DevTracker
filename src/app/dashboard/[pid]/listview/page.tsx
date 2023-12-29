import ListView from "@/components/ListView"
interface PageParams {
	params: {
		pid: string
	}
}
const Page = async ({ params }: PageParams) => {
	return <ListView />
}

export default Page
