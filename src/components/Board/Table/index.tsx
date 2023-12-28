"use client"
import {
	DndContext,
	DragEndEvent,
	DragMoveEvent,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	closestCorners,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { $Enums } from "@prisma/client"
import Columns from "../Columns/index"
import { useState } from "react"
import { trpc } from "@/app/_trpc/client"

interface KanbanTableProps {
	tableData: {
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
	}[]
}

const KanBanTable = ({ tableData }: KanbanTableProps) => {
	const [initialData, changeInitialData] = useState(tableData)
	const [selectedCardId, setSelectedCardId] = useState<UniqueIdentifier>("")

	const { mutate: updateIssueStatus } =
		trpc.issue.updateIssueStatus.useMutation()
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)
	function handleDragStart(event: DragStartEvent) {
		const { active } = event
		const { id } = active
		setSelectedCardId(id)
	}
	function handleDragMove(event: DragMoveEvent) {
		// console.log(event)
	}
	/*
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		console.log(event)

		// Handling Container Sorting
		if (
			active.id.toString().includes("container") &&
			over?.id.toString().includes("container") &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the index of the active and over container
			const activeContainerIndex = initialData.findIndex(
				(container) => container.key === active.id
			)
			const overContainerIndex = initialData.findIndex(
				(container) => container.key === over.id
			)
			// Swap the active and over container
			let newItems = [...initialData]
			newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
			changeInitialData(newItems)
		}

		// Handling item Sorting
		if (
			active.id.toString().includes("item") &&
			over?.id.toString().includes("item") &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, "item")
			const overContainer = findValueOfItems(over.id, "item")

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			// Find the index of the active and over container
			const activeContainerIndex = initialData.findIndex(
				(container) => container.id === activeContainer.id
			)
			const overContainerIndex = initialData.findIndex(
				(container) => container.id === overContainer.id
			)
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex(
				(item) => item.id === active.id
			)
			const overitemIndex = overContainer.items.findIndex(
				(item) => item.id === over.id
			)

			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newItems = [...initialData]
				newItems[activeContainerIndex].items = arrayMove(
					newItems[activeContainerIndex].items,
					activeitemIndex,
					overitemIndex
				)
				changeInitialData(newItems)
			} else {
				// In different containers
				let newItems = [...initialData]
				const [removeditem] = newItems[activeContainerIndex].items.splice(
					activeitemIndex,
					1
				)
				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
				changeInitialData(newItems)
			}
		}

		// Handling item dropping into Container
		if (
			active.id.toString().includes("item") &&
			over?.id.toString().includes("container") &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, "item")
			const overContainer = findValueOfItems(over.id, "container")

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex(
				(container) => container.id === activeContainer.id
			)
			const overContainerIndex = containers.findIndex(
				(container) => container.id === overContainer.id
			)
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex(
				(item) => item.id === active.id
			)

			let newItems = [...containers]
			const [removeditem] = newItems[activeContainerIndex].items.splice(
				activeitemIndex,
				1
			)
			newItems[overContainerIndex].items.push(removeditem)
			setContainers(newItems)
		}
	}
	*/
	return (
		<div className="grid grid-cols-4 gap-2 md:gap-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragMove={handleDragMove}
				// onDragEnd={handleDragEnd}
			>
				<SortableContext items={["new", "active", "resolved", "closed"]}>
					{initialData.map((column, index) => (
						<Columns columnDetails={column} key={index} />
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default KanBanTable
