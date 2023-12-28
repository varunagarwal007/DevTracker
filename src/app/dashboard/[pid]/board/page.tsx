import Board from "@/components/Board"
const Page = async ({ params }: { params: { pid: string } }) => {
	return <Board projectId={params.pid} />
}

export default Page
