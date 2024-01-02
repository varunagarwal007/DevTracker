import Image from "next/image"
import React from "react"

const Page = () => {
	return (
		<div className="w-full flex flex-col items-center">
			<Image src={"/team_work_svg.svg"} height={400} width={400} alt="code" />
			<div className="text-xl ">This section is work in progress...</div>
		</div>
	)
}

export default Page
