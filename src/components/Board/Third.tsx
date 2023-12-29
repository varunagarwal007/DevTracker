// "use client"
// import {
// 	DndContext,
// 	DragEndEvent,
// 	DragMoveEvent,
// 	DragStartEvent,
// 	KeyboardSensor,
// 	PointerSensor,
// 	UniqueIdentifier,
// 	closestCorners,
// 	useSensor,
// 	useSensors,
// } from "@dnd-kit/core"
// import {
// 	SortableContext,
// 	arrayMove,
// 	sortableKeyboardCoordinates,
// } from "@dnd-kit/sortable"
// import { $Enums } from "@prisma/client"
// import Columns from "../Columns/index"
// import { useState } from "react"
// import { trpc } from "@/app/_trpc/client"

// interface KanbanTableProps {
// 	tableData: {
// 		title: string
// 		key: string
// 		items: {
// 			id: string
// 			title: string
// 			description: string
// 			type: $Enums.issue_type // Assuming an enum for issue types
// 			status: $Enums.issue_status // Assuming an enum for issue statuses
// 			due_date: string
// 			priority: number | null
// 			assignedTo: {
// 				id: string
// 				email: string | null
// 				name: string | null
// 				createdAt: Date
// 				updatedAt: Date
// 				role: $Enums.user_role // Assuming an enum for user roles
// 				avatar: string | null
// 				projectId: string | null
// 			} | null
// 		}[]
// 	}[]
// 	refetch: () => void
// }

// const KanBanTable = ({ tableData, refetch }: KanbanTableProps) => {
// 	const [initialData, changeInitialData] = useState(tableData)
// 	const [selectedCardId, setSelectedCardId] = useState<UniqueIdentifier>("")

// 	const { mutate: changeIssueStatus } =
// 		trpc.issue.updateIssueStatus.useMutation()
// 	const sensors = useSensors(
// 		useSensor(PointerSensor),
// 		useSensor(KeyboardSensor, {
// 			coordinateGetter: sortableKeyboardCoordinates,
// 		})
// 	)
// 	function handleDragStart(event: DragStartEvent) {
// 		const { active } = event
// 		const { id } = active
// 		setSelectedCardId(id)
// 	}
// 	const handleDragMove = (event: DragMoveEvent) => {
// 		const { active, over } = event
// 		let columnIds = ["new", "active", "resolved", "closed"]
// 		console.log(event)

// 		// Handle Items Sorting
// 		if (over && active && active.id && over?.id && active.id !== over.id) {
// 			// Find the active container and over container
// 			const activeContainer = initialData.find((columns) =>
// 				columns.items.find((item) => item.id === active.id)
// 			)
// 			const overContainer = initialData.find((columns) =>
// 				columns.items.find((item) => item.id === over.id)
// 			)

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return

// 			// Find the index of the active and over container
// 			const activeContainerIndex = initialData.findIndex(
// 				(container) => container.key === activeContainer.key
// 			)
// 			const overContainerIndex = initialData.findIndex(
// 				(container) => container.key === overContainer.key
// 			)

// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items?.findIndex(
// 				(item) => item.id === active.id
// 			)
// 			const overitemIndex = overContainer.items?.findIndex(
// 				(item) => item.id === over.id
// 			)
// 			// In the same container
// 			if (activeContainerIndex === overContainerIndex) {
// 				let newItems = [...initialData]
// 				newItems[activeContainerIndex].items = arrayMove(
// 					newItems[activeContainerIndex].items,
// 					activeitemIndex,
// 					overitemIndex
// 				)

// 				changeInitialData(newItems)
// 			} else {
// 				// In different containers
// 				let newItems = [...initialData]
// 				const [removeditem] = newItems[activeContainerIndex].items.splice(
// 					activeitemIndex,
// 					1
// 				)
// 				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
// 				changeInitialData(newItems)
// 			}
// 		}

// 		// Handling Item Drop Into a Container
// 		if (
// 			active &&
// 			over &&
// 			active.id.toString() &&
// 			columnIds.includes(over?.id.toString()) &&
// 			active.id !== over.id
// 		) {
// 			// Find the active and over container
// 			const activeContainer = initialData.find((columns) =>
// 				columns.items.find((item) => item.id === active.id)
// 			)
// 			const overContainer = initialData.find(
// 				(columns) => columns.key === over.id
// 			)

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return
// 			let overIdString = over.id.toString().toUpperCase()
// 			changeIssueStatus({
// 				issue_id: active.id.toString(),
// 				issue_status:
// 					overIdString === "NEW"
// 						? $Enums.issue_status.NEW
// 						: overIdString === "ACTIVE"
// 						? $Enums.issue_status.ACTIVE
// 						: overIdString === "RESOLVED"
// 						? $Enums.issue_status.RESOLVED
// 						: $Enums.issue_status.CLOSED,
// 			})
// 			refetch()
// 			// Find the index of the active and over container
// 			const activeContainerIndex = initialData.findIndex(
// 				(container) => container.key === activeContainer.key
// 			)
// 			const overContainerIndex = initialData.findIndex(
// 				(container) => container.key === overContainer.key
// 			)

// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items?.findIndex(
// 				(item) => item.id === active.id
// 			)

// 			// Remove the active item from the active container and add it to the over container
// 			let newItems = [...initialData]
// 			const [removeditem] = newItems[activeContainerIndex].items.splice(
// 				activeitemIndex,
// 				1
// 			)
// 			newItems[overContainerIndex].items?.push(removeditem)
// 			changeInitialData(newItems)
// 		}
// 	}

// 	function handleDragEnd(event: DragEndEvent) {
// 		const { active, over } = event
// 		console.log(event)
// 		let columnIds = ["new", "active", "resolved", "closed"]

// 		// Handling Container Sorting
// 		if (
// 			over &&
// 			active &&
// 			columnIds.includes(active.id.toString()) &&
// 			columnIds.includes(over?.id.toString()) &&
// 			active.id !== over.id
// 		) {
// 			// Find the index of the active and over container
// 			const activeContainerIndex = initialData.findIndex(
// 				(container) => container.key === active.id
// 			)
// 			const overContainerIndex = initialData.findIndex(
// 				(container) => container.key === over.id
// 			)
// 			// Swap the active and over container
// 			let newItems = [...initialData]
// 			newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
// 			changeInitialData(newItems)
// 		}

// 		// Handling item dropping into Container
// 		if (
// 			active &&
// 			over &&
// 			active.id.toString() &&
// 			columnIds.includes(over?.id.toString()) &&
// 			active.id !== over.id
// 		) {
// 			// Find the active and over container
// 			const activeContainer = initialData.find((columns) =>
// 				columns.items.find((item) => item.id === active.id)
// 			)
// 			const overContainer = initialData.find(
// 				(columns) => columns.key === over.id
// 			)

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return
// 			// Find the index of the active and over container
// 			let overIdString = over.id.toString().toUpperCase()
// 			console.log("Here")
// 			changeIssueStatus({
// 				issue_id: active.id.toString(),
// 				issue_status:
// 					overIdString === "NEW"
// 						? $Enums.issue_status.NEW
// 						: overIdString === "ACTIVE"
// 						? $Enums.issue_status.ACTIVE
// 						: overIdString === "RESOLVED"
// 						? $Enums.issue_status.RESOLVED
// 						: $Enums.issue_status.CLOSED,
// 			})
// 			refetch()
// 			const activeContainerIndex = initialData.findIndex(
// 				(container) => container.key === activeContainer.key
// 			)
// 			const overContainerIndex = initialData.findIndex(
// 				(container) => container.key === overContainer.key
// 			)
// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items.findIndex(
// 				(item) => item.id === active.id
// 			)

// 			let newItems = [...initialData]
// 			const [removeditem] = newItems[activeContainerIndex].items.splice(
// 				activeitemIndex,
// 				1
// 			)
// 			newItems[overContainerIndex].items.push(removeditem)
// 			changeInitialData(newItems)
// 		}

// 		// Handling item Sorting
// 		console.log("Here")
// 		if (active && over && active.id && over?.id && active.id !== over.id) {
// 			// Find the active and over container
// 			const activeContainer = initialData.find((columns) =>
// 				columns.items.find((item) => item.id === active.id)
// 			)
// 			const overContainer = initialData.find((columns) =>
// 				columns.items.find((item) => item.id === over.id)
// 			)

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return
// 			// Find the index of the active and over container
// 			const activeContainerIndex = initialData.findIndex(
// 				(container) => container.key === activeContainer.key
// 			)
// 			const overContainerIndex = initialData.findIndex(
// 				(container) => container.key === overContainer.key
// 			)
// 			console.log("Here")
// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items.findIndex(
// 				(item) => item.id === active.id
// 			)
// 			const overitemIndex = overContainer.items.findIndex(
// 				(item) => item.id === over.id
// 			)

// 			// In the same container
// 			if (activeContainerIndex === overContainerIndex) {
// 				let newItems = [...initialData]
// 				newItems[activeContainerIndex].items = arrayMove(
// 					newItems[activeContainerIndex].items,
// 					activeitemIndex,
// 					overitemIndex
// 				)
// 				changeInitialData(newItems)
// 			} else {
// 				// In different containers
// 				let newItems = [...initialData]
// 				const [removeditem] = newItems[activeContainerIndex].items.splice(
// 					activeitemIndex,
// 					1
// 				)
// 				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
// 				changeInitialData(newItems)
// 			}
// 		}
// 	}

// 	return (
// 		<div className="grid grid-cols-4 gap-2 md:gap-4">
// 			<DndContext
// 				sensors={sensors}
// 				collisionDetection={closestCorners}
// 				onDragStart={handleDragStart}
// 				onDragMove={handleDragMove}
// 				onDragEnd={handleDragEnd}
// 			>
// 				<SortableContext items={["new", "active", "resolved", "closed"]}>
// 					{initialData.map((column, index) => (
// 						<Columns columnDetails={column} key={index} />
// 					))}
// 				</SortableContext>
// 			</DndContext>
// 		</div>
// 	)
// }

// export default KanBanTable
