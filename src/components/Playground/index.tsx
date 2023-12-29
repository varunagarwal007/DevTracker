"use client"
import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"

const PlayGround = () => {
	return (
		<div
			className="w-full grid h-[calc(100vh-10rem)] -z-10"
			style={{
				gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
				gap: 64,
			}}
		>
			<Tldraw className="-z-10" />
		</div>
	)
}

export default PlayGround
