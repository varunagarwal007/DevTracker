"use client"

import ProjectLandingPage from "./ProjectLandingPageWrapper"

const Overview = ({ projectId }: { projectId: string }) => {
	return (
		<>
			<ProjectLandingPage projectId={projectId}>Overview</ProjectLandingPage>
		</>
	)
}

export default Overview
