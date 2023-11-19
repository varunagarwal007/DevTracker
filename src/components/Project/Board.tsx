"use client"
import ProjectLandingPage from "./ProjectLandingPageWrapper"
import TaskBoard from "../Board"
const Board = ({ projectId }: { projectId: string }) => {
	return (
		<ProjectLandingPage projectId={projectId}>
			<div className="flex flex-col w-full">
				<div className="py-2 h-20 w-full ">
					<h3 className="text-2xl font-bold text-primary">Welcome back!</h3>
					<p className="text-muted-foreground">
						Here is the KanBan Board view for your project.
					</p>
				</div>
				<TaskBoard />
			</div>
		</ProjectLandingPage>
	)
}

export default Board
