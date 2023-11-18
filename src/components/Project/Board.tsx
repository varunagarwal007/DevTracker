import React from "react"
import ProjectLandingPage from "./ProjectLandingPageWrapper"

const Board = ({ projectId }: { projectId: string }) => {
	return <ProjectLandingPage projectId={projectId}>Board</ProjectLandingPage>
}

export default Board
