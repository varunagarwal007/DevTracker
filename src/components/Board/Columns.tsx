"use client"
import React, { ReactElement, ReactNode, useId } from "react"
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core"
import Card from "./Card"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { Button } from "../ui/button"
import { GripHorizontal, Plus } from "lucide-react"

interface ColumnProps {
	id: UniqueIdentifier
	children: React.ReactNode
	title?: string
	description?: string
	onAddItem?: () => void
}

const Columns = ({
	id,
	children,
	title,
	description,
	onAddItem,
}: ColumnProps) => {
	const {
		attributes,
		setNodeRef,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
		data: {
			type: "container",
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
					<h1 className="text-primary text-lg font-semibold">{title}</h1>
					<GripHorizontal className="w-5 h-5 group-hover:visible invisible text-muted-foreground" />
				</div>
			</div>
			{children}
			<Button
				variant="ghost"
				onClick={onAddItem}
				className="text-muted-foreground max-w-fit shadow-sm self-center"
			>
				Add Item <Plus className="w-4 h-4 mx-3" />
			</Button>
		</div>
	)
}
export default Columns
