// import { trpc } from "@/app/_trpc/client"
// import { IssueStatus } from "@/lib/constants/ClientConstants"
// import {
// 	DndContext,
// 	DragEndEvent,
// 	DragMoveEvent,
// 	DragOverlay,
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
// import { useId, useState } from "react"
// import Card from "./Card"
// import Columns from "./Columns"
// import { ProjectType } from "@/lib/types/ProjectTypes"
// import { Issue, issue_status } from "@/lib/types/Issues"
// import { user_role } from "@/lib/types/user"
// interface Cards {
// 	title: string
// 	id: string
// 	parent: string
// }

// type KanbanLaneType = {
// 	id: string
// 	title: string
// 	items?: {
// 		id: string
// 		created_by: {
// 			id: string
// 			email: string | null
// 			role: string
// 			avatar: string | null
// 		}
// 		title: string
// 		description: string | null
// 		due_date: string | null
// 		priority: number | null
// 		status: string
// 	}[]
// }

// const TaskBoard = ({ projectId }: { projectId: string }) => {
// 	const { data, isLoading } = trpc.project.getProjectDetail.useQuery(
// 		{ id: projectId },
// 		{ staleTime: 60 * 60 * 1000 }
// 	)

// 	let demoCol: KanbanLaneType[] = [
// 		...IssueStatus.map((i) => ({
// 			id: i.key,
// 			title: i.title,
// 			items: data?.Issues,
// 		})),
// 	]

// 	const [containers, setContainers] = useState<KanbanLaneType[]>(demoCol)
// 	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

// 	const sensors = useSensors(
// 		useSensor(PointerSensor),
// 		useSensor(KeyboardSensor, {
// 			coordinateGetter: sortableKeyboardCoordinates,
// 		})
// 	)

// 	function handleDragStart(event: DragStartEvent) {
// 		const { active } = event
// 		const { id } = active
// 		setActiveId(id)
// 	}
// 	/*
// 	  const handleDragMove = (event: DragMoveEvent) => {
// 		const { active, over } = event;

// 		// Handle Items Sorting
// 		if (
// 		  active.id.toString().includes('item') &&
// 		  over?.id.toString().includes('item') &&
// 		  active &&
// 		  over &&
// 		  active.id !== over.id
// 		) {
// 		  // Find the active container and over container
// 		  const activeContainer = findValueOfItems(active.id, 'item');
// 		  const overContainer = findValueOfItems(over.id, 'item');

// 		  // If the active or over container is not found, return
// 		  if (!activeContainer || !overContainer) return;

// 		  // Find the index of the active and over container
// 		  const activeContainerIndex = containers.findIndex(
// 			(container) => container.id === activeContainer.id,
// 		  );
// 		  const overContainerIndex = containers.findIndex(
// 			(container) => container.id === overContainer.id,
// 		  );

// 		  // Find the index of the active and over item
// 		  const activeitemIndex = activeContainer.items.findIndex(
// 			(item) => item.id === active.id,
// 		  );
// 		  const overitemIndex = overContainer.items.findIndex(
// 			(item) => item.id === over.id,
// 		  );
// 		  // In the same container
// 		  if (activeContainerIndex === overContainerIndex) {
// 			let newItems = [...containers];
// 			newItems[activeContainerIndex].items = arrayMove(
// 			  newItems[activeContainerIndex].items,
// 			  activeitemIndex,
// 			  overitemIndex,
// 			);

// 			setContainers(newItems);
// 		  } else {
// 			// In different containers
// 			let newItems = [...containers];
// 			const [removeditem] = newItems[activeContainerIndex].items.splice(
// 			  activeitemIndex,
// 			  1,
// 			);
// 			newItems[overContainerIndex].items.splice(
// 			  overitemIndex,
// 			  0,
// 			  removeditem,
// 			);
// 			setContainers(newItems);
// 		  }
// 		}

// 		// Handling Item Drop Into a Container
// 		if (
// 		  active.id.toString().includes('item') &&
// 		  over?.id.toString().includes('container') &&
// 		  active &&
// 		  over &&
// 		  active.id !== over.id
// 		) {
// 		  // Find the active and over container
// 		  const activeContainer = findValueOfItems(active.id, 'item');
// 		  const overContainer = findValueOfItems(over.id, 'container');

// 		  // If the active or over container is not found, return
// 		  if (!activeContainer || !overContainer) return;

// 		  // Find the index of the active and over container
// 		  const activeContainerIndex = containers.findIndex(
// 			(container) => container.id === activeContainer.id,
// 		  );
// 		  const overContainerIndex = containers.findIndex(
// 			(container) => container.id === overContainer.id,
// 		  );

// 		  // Find the index of the active and over item
// 		  const activeitemIndex = activeContainer.items.findIndex(
// 			(item) => item.id === active.id,
// 		  );

// 		  // Remove the active item from the active container and add it to the over container
// 		  let newItems = [...containers];
// 		  const [removeditem] = newItems[activeContainerIndex].items.splice(
// 			activeitemIndex,
// 			1,
// 		  );
// 		  newItems[overContainerIndex].items.push(removeditem);
// 		  setContainers(newItems);
// 		}
// 	  };
// 	  */
// 	function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
// 		if (type === "container") {
// 			return containers.find((item) => item.id === id)
// 		}
// 		if (type === "item") {
// 			return containers.find(
// 				(container) => container.items?.find((item) => item.id === id)
// 			)
// 		}
// 	}

// 	const findItemTitle = (id: UniqueIdentifier | undefined) => {
// 		const container = findValueOfItems(id, "item")
// 		if (!container) return ""
// 		const item = container?.items?.find((item) => item.id === id)
// 		if (!item) return ""
// 		return item.title
// 	}

// 	const findContainerTitle = (id: UniqueIdentifier | undefined) => {
// 		const container = findValueOfItems(id, "container")
// 		if (!container) return ""
// 		return container.title
// 	}

// 	const findContainerItems = (id: UniqueIdentifier | undefined) => {
// 		const container = findValueOfItems(id, "container")
// 		if (!container) return []
// 		return container.items
// 	}

// 	const handleDragMove = (event: DragMoveEvent) => {
// 		const { active, over } = event

// 		// Handle Items Sorting
// 		if (
// 			active.id.toString().includes("item") &&
// 			over?.id.toString().includes("item") &&
// 			active &&
// 			over &&
// 			active.id !== over.id
// 		) {
// 			// Find the active container and over container
// 			const activeContainer = findValueOfItems(active.id, "item")
// 			const overContainer = findValueOfItems(over.id, "item")

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return

// 			// Find the index of the active and over container
// 			const activeContainerIndex = containers.findIndex(
// 				(container) => container.id === activeContainer.id
// 			)
// 			const overContainerIndex = containers.findIndex(
// 				(container) => container.id === overContainer.id
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
// 				let newItems = [...containers]
// 				newItems[activeContainerIndex].items = arrayMove(
// 					newItems[activeContainerIndex].items,
// 					activeitemIndex,
// 					overitemIndex
// 				)

// 				setContainers(newItems)
// 			} else {
// 				// In different containers
// 				let newItems = [...containers]
// 				const [removeditem] = newItems[activeContainerIndex].items.splice(
// 					activeitemIndex,
// 					1
// 				)
// 				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
// 				setContainers(newItems)
// 			}
// 		}

// 		// Handling Item Drop Into a Container
// 		if (
// 			active.id.toString().includes("item") &&
// 			over?.id.toString().includes("container") &&
// 			active &&
// 			over &&
// 			active.id !== over.id
// 		) {
// 			// Find the active and over container
// 			const activeContainer = findValueOfItems(active.id, "item")
// 			const overContainer = findValueOfItems(over.id, "container")

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return

// 			// Find the index of the active and over container
// 			const activeContainerIndex = containers.findIndex(
// 				(container) => container.id === activeContainer.id
// 			)
// 			const overContainerIndex = containers.findIndex(
// 				(container) => container.id === overContainer.id
// 			)

// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items?.findIndex(
// 				(item) => item.id === active.id
// 			)

// 			// Remove the active item from the active container and add it to the over container
// 			let newItems = [...containers]
// 			const [removeditem] = newItems[activeContainerIndex].items.splice(
// 				activeitemIndex,
// 				1
// 			)
// 			newItems[overContainerIndex].items?.push(removeditem)
// 			setContainers(newItems)
// 		}
// 	}

// 	// This is the function that handles the sorting of the containers and items when the user is done dragging.
// 	function handleDragEnd(event: DragEndEvent) {
// 		const { active, over } = event
// 		console.log(event)

// 		// Handling Container Sorting
// 		if (
// 			active.id.toString().includes("container") &&
// 			over?.id.toString().includes("container") &&
// 			active &&
// 			over &&
// 			active.id !== over.id
// 		) {
// 			// Find the index of the active and over container
// 			const activeContainerIndex = containers.findIndex(
// 				(container) => container.id === active.id
// 			)
// 			const overContainerIndex = containers.findIndex(
// 				(container) => container.id === over.id
// 			)
// 			// Swap the active and over container
// 			let newItems = [...containers]
// 			newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
// 			setContainers(newItems)
// 		}

// 		// Handling item Sorting
// 		if (
// 			active.id.toString().includes("item") &&
// 			over?.id.toString().includes("item") &&
// 			active &&
// 			over &&
// 			active.id !== over.id
// 		) {
// 			// Find the active and over container
// 			const activeContainer = findValueOfItems(active.id, "item")
// 			const overContainer = findValueOfItems(over.id, "item")

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return
// 			// Find the index of the active and over container
// 			const activeContainerIndex = containers.findIndex(
// 				(container) => container.id === activeContainer.id
// 			)
// 			const overContainerIndex = containers.findIndex(
// 				(container) => container.id === overContainer.id
// 			)
// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items.findIndex(
// 				(item) => item.id === active.id
// 			)
// 			const overitemIndex = overContainer.items.findIndex(
// 				(item) => item.id === over.id
// 			)

// 			// In the same container
// 			if (activeContainerIndex === overContainerIndex) {
// 				let newItems = [...containers]
// 				newItems[activeContainerIndex].items = arrayMove(
// 					newItems[activeContainerIndex].items,
// 					activeitemIndex,
// 					overitemIndex
// 				)
// 				setContainers(newItems)
// 			} else {
// 				// In different containers
// 				let newItems = [...containers]
// 				const [removeditem] = newItems[activeContainerIndex].items.splice(
// 					activeitemIndex,
// 					1
// 				)
// 				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
// 				setContainers(newItems)
// 			}
// 		}
// 		// Handling item dropping into Container
// 		if (
// 			active.id.toString().includes("item") &&
// 			over?.id.toString().includes("container") &&
// 			active &&
// 			over &&
// 			active.id !== over.id
// 		) {
// 			// Find the active and over container
// 			const activeContainer = findValueOfItems(active.id, "item")
// 			const overContainer = findValueOfItems(over.id, "container")

// 			// If the active or over container is not found, return
// 			if (!activeContainer || !overContainer) return
// 			// Find the index of the active and over container
// 			const activeContainerIndex = containers.findIndex(
// 				(container) => container.id === activeContainer.id
// 			)
// 			const overContainerIndex = containers.findIndex(
// 				(container) => container.id === overContainer.id
// 			)
// 			// Find the index of the active and over item
// 			const activeitemIndex = activeContainer.items.findIndex(
// 				(item) => item.id === active.id
// 			)

// 			let newItems = [...containers]
// 			const [removeditem] = newItems[activeContainerIndex].items.splice(
// 				activeitemIndex,
// 				1
// 			)
// 			newItems[overContainerIndex].items.push(removeditem)
// 			setContainers(newItems)
// 		}
// 		setActiveId(null)
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
// 				<SortableContext items={containers.map((i) => i.id)}>
// 					{containers.map((container) => (
// 						<Columns
// 							id={container.id}
// 							title={container.title}
// 							key={container.id}
// 							onAddItem={() => {}}
// 						>
// 							<SortableContext items={container.items.map((i) => i.id)}>
// 								<div className="flex items-start flex-col gap-y-3">
// 									{container.items.map((i) => (
// 										<Card title={i.title} id={i.id} key={i.id} />
// 									))}
// 								</div>
// 							</SortableContext>
// 						</Columns>
// 					))}
// 				</SortableContext>
// 				<DragOverlay adjustScale={false}>
// 					{/* Drag Overlay For item Item */}
// 					{activeId && activeId.toString().includes("item") && (
// 						<Card id={activeId} title={findItemTitle(activeId)} />
// 					)}
// 					{/* Drag Overlay For Container */}
// 					{activeId && activeId.toString().includes("container") && (
// 						<Columns id={activeId} title={findContainerTitle(activeId)}>
// 							{findContainerItems(activeId).map((i) => (
// 								<Card key={i.id} title={i.title} id={i.id} />
// 							))}
// 						</Columns>
// 					)}
// 				</DragOverlay>
// 			</DndContext>
// 		</div>
// 	)
// }

// export default TaskBoard
