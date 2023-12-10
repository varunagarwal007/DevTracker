"use client"

import { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"

const Card = ({ title, id }: { title: string; id: UniqueIdentifier }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
		data: {
			type: "item",
		},
	})

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				"px-2 py-4 rounded-lg w-full border-2 border-primary cursor-pointer h-32",
				isDragging && "opacity-50"
			)}
		>
			<div className="flex items-center justify-between">{title}</div>
		</div>
	)
}
export default Card
