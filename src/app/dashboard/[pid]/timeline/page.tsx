import TimeLine from "@/components/Timeline"
interface PageParams {
	params: {
		pid: string
	}
}
const Page = async ({ params }: PageParams) => {
	return <TimeLine />
}

export default Page
