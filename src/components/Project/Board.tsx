"use client"
import TaskBoard from "../Board"
const Board = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="py-2 h-20 w-full ">
				<h3 className="text-2xl font-bold text-primary">Welcome back!</h3>
				<p className="text-muted-foreground">
					Here is the KanBan Board view for your project.
				</p>
			</div>
			<TaskBoard />
		</div>
	)
}

export default Board
