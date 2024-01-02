"use client"
import {
	DndContext,
	DragEndEvent,
	DragMoveEvent,
	DragOverlay,
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
import { useEffect, useState } from "react"
import { trpc } from "@/app/_trpc/client"
import IssueCard from "../IssueCard"

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
			task_number: number
			labels: $Enums.issue_labels
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
	refetch: () => void
	search?: string
}

const KanBanTable = ({ tableData, refetch, search }: KanbanTableProps) => {
	const [initialData, changeInitialData] = useState(tableData)
	const [selectedCardId, setSelectedCardId] = useState("")

	const { mutate: changeIssueStatus } =
		trpc.issue.updateIssueStatus.useMutation({
			onSuccess: () => {
				refetch()
			},
		})
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)
	function handleDragStart(event: DragStartEvent) {
		const { active } = event
		const { id } = active
		setSelectedCardId(id.toString())
	}
	const handleDragMove = (event: DragMoveEvent) => {
		const { active, over } = event
		let columnIds = ["new", "active", "resolved", "closed"]

		// Handle Items Sorting
		if (over && active && active.id && over?.id && active.id !== over.id) {
			// Find the active container and over container
			const activeContainer = initialData.find((columns) =>
				columns.items.find((item) => item.id === active.id)
			)
			const overContainer = initialData.find((columns) =>
				columns.items.find((item) => item.id === over.id)
			)

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return

			// Find the index of the active and over container
			const activeContainerIndex = initialData.findIndex(
				(container) => container.key === activeContainer.key
			)
			const overContainerIndex = initialData.findIndex(
				(container) => container.key === overContainer.key
			)

			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items?.findIndex(
				(item) => item.id === active.id
			)
			const overitemIndex = overContainer.items?.findIndex(
				(item) => item.id === over.id
			)
			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				// let newItems = [...initialData]
				// newItems[activeContainerIndex].items = arrayMove(
				// 	newItems[activeContainerIndex].items,
				// 	activeitemIndex,
				// 	overitemIndex
				// )
				// changeInitialData(newItems)
			} else {
				// In different containers
				let newItems = [...initialData]
				const [removeditem] = newItems[activeContainerIndex].items.splice(
					activeitemIndex,
					1
				)

				let temp_issue_status = newItems[overContainerIndex].key.toUpperCase()

				changeIssueStatus({
					issue_id: removeditem.id,
					issue_status:
						temp_issue_status === "NEW"
							? $Enums.issue_status.NEW
							: temp_issue_status === "ACTIVE"
							? $Enums.issue_status.ACTIVE
							: temp_issue_status === "RESOLVED"
							? $Enums.issue_status.RESOLVED
							: $Enums.issue_status.CLOSED,
				})
				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)

				// changeInitialData(newItems)
			}
		}

		// Handling Item Drop Into a Container
		if (
			active &&
			over &&
			active.id.toString() &&
			columnIds.includes(over?.id.toString()) &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = initialData.find((columns) =>
				columns.items.find((item) => item.id === active.id)
			)
			const overContainer = initialData.find(
				(columns) => columns.key === over.id
			)

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			let overIdString = over.id.toString().toUpperCase()
			changeIssueStatus({
				issue_id: active.id.toString(),
				issue_status:
					overIdString === "NEW"
						? $Enums.issue_status.NEW
						: overIdString === "ACTIVE"
						? $Enums.issue_status.ACTIVE
						: overIdString === "RESOLVED"
						? $Enums.issue_status.RESOLVED
						: $Enums.issue_status.CLOSED,
			})

			// Find the index of the active and over container
			const activeContainerIndex = initialData.findIndex(
				(container) => container.key === activeContainer.key
			)
			const overContainerIndex = initialData.findIndex(
				(container) => container.key === overContainer.key
			)

			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items?.findIndex(
				(item) => item.id === active.id
			)

			// Remove the active item from the active container and add it to the over container
			let newItems = [...initialData]
			const [removeditem] = newItems[activeContainerIndex].items.splice(
				activeitemIndex,
				1
			)
			newItems[overContainerIndex].items?.push(removeditem)
			changeInitialData(newItems)
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		let columnIds = ["new", "active", "resolved", "closed"]

		// Handling Container Sorting
		if (
			over &&
			active &&
			columnIds.includes(active.id.toString()) &&
			columnIds.includes(over?.id.toString()) &&
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

		// Handling item dropping into Container
		if (
			active &&
			over &&
			active.id.toString() &&
			columnIds.includes(over?.id.toString()) &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = initialData.find((columns) =>
				columns.items.find((item) => item.id === active.id)
			)
			const overContainer = initialData.find(
				(columns) => columns.key === over.id
			)

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			// Find the index of the active and over container
			let overIdString = over.id.toString().toUpperCase()

			changeIssueStatus({
				issue_id: active.id.toString(),
				issue_status:
					overIdString === "NEW"
						? $Enums.issue_status.NEW
						: overIdString === "ACTIVE"
						? $Enums.issue_status.ACTIVE
						: overIdString === "RESOLVED"
						? $Enums.issue_status.RESOLVED
						: $Enums.issue_status.CLOSED,
			})
			const activeContainerIndex = initialData.findIndex(
				(container) => container.key === activeContainer.key
			)
			const overContainerIndex = initialData.findIndex(
				(container) => container.key === overContainer.key
			)
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex(
				(item) => item.id === active.id
			)

			let newItems = [...initialData]
			const [removeditem] = newItems[activeContainerIndex].items.splice(
				activeitemIndex,
				1
			)
			newItems[overContainerIndex].items.push(removeditem)
			changeInitialData(newItems)
		}

		// Handling item Sorting

		if (active && over && active.id && over?.id && active.id !== over.id) {
			// Find the active and over container
			const activeContainer = initialData.find((columns) =>
				columns.items.find((item) => item.id === active.id)
			)
			const overContainer = initialData.find((columns) =>
				columns.items.find((item) => item.id === over.id)
			)

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			// Find the index of the active and over container
			const activeContainerIndex = initialData.findIndex(
				(container) => container.key === activeContainer.key
			)
			const overContainerIndex = initialData.findIndex(
				(container) => container.key === overContainer.key
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
	}

	useEffect(() => {
		changeInitialData(tableData)
	}, [tableData])

	return (
		<div className="grid grid-cols-4 gap-2 md:gap-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragMove={handleDragMove}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={["new", "active", "resolved", "closed"]}>
					{initialData.map((column, index) => (
						<Columns columnDetails={column} key={index} />
					))}
				</SortableContext>
				<DragOverlay adjustScale={false}>
					{/* Drag Overlay For Container */}
					{selectedCardId &&
						["new", "active", "closed", "resolved"].includes(
							selectedCardId
						) && (
							<Columns
								columnDetails={
									initialData.filter((i) => i.key === selectedCardId)[0]
								}
								key={selectedCardId}
							/>
						)}
					{/* Drag Overlay For item Item */}
					{selectedCardId && (
						<IssueCard
							//@ts-ignore
							cardDetails={
								initialData.find(
									(c) => c.items?.find((i) => i.id === selectedCardId)
								)?.items[0]
							}
						/>
					)}
				</DragOverlay>
			</DndContext>
		</div>
	)
}

export default KanBanTable
