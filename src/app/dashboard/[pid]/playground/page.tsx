import PlayGround from "@/components/Playground"
interface PageParams {
	params: {
		pid: string
	}
}
const Page = async ({ params }: PageParams) => {
	return <PlayGround />
}

export default Page
