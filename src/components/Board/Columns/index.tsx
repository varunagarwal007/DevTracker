import { Button } from "@/components/ui/button"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { $Enums } from "@prisma/client"
import clsx from "clsx"
import { GripHorizontal, Plus } from "lucide-react"
import React from "react"
import IssueCard from "../IssueCard"

interface ColumnProps {
	columnDetails: {
		title: string
		key: string
		items: {
			id: string
			title: string
			description: string
			type: $Enums.issue_type // Assuming an enum for issue types
			status: $Enums.issue_status // Assuming an enum for issue statuses
			due_date: string
			priority: number | null
			assignedTo: {
				id: string
				email: string | null
				name: string | null
				createdAt: Date
				updatedAt: Date
				role: $Enums.user_role // Assuming an enum for user roles
				avatar: string | null
				projectId: string | null
			} | null
		}[]
	}
}
const Columns = ({ columnDetails }: ColumnProps) => {
	const {
		attributes,
		setNodeRef,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: columnDetails.key,
		data: {
			type: "column",
			columnDetails,
		},
	})
	return (
		<div
			{...attributes}
			ref={setNodeRef}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				"w-full h-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex flex-col gap-y-4 group",
				isDragging && "opacity-50"
			)}
		>
			<div className="flex items-center justify-between">
				<div className="w-full h-10 flex justify-between" {...listeners}>
					<h1 className="text-primary text-lg font-semibold">
						{columnDetails.title}
					</h1>
					<GripHorizontal className="w-5 h-5 group-hover:visible invisible text-muted-foreground" />
				</div>
			</div>
			<SortableContext items={columnDetails.items.map((i) => i.id)}>
				<div className="flex items-start flex-col gap-y-3">
					{columnDetails.items.map((i, index) => (
						<IssueCard cardDetails={i} key={index} />
					))}
				</div>
			</SortableContext>
		</div>
	)
}

export default Columns
