import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
	issue_type,
	issue_status,
	user_role,
	issue_labels,
} from "@prisma/client"
import clsx from "clsx"
import {
	BookOpenText,
	Bug,
	Check,
	CheckSquareIcon,
	ListChecksIcon,
} from "lucide-react"
import Link from "next/link"
import React from "react"
interface CardProps {
	cardDetails: {
		id: string
		title: string
		description: string
		type: issue_type // Assuming an enum for issue types
		status: issue_status // Assuming an enum for issue statuses
		due_date: string
		priority: number | null
		labels: issue_labels
		task_number: number
		assignedTo: {
			id: string
			email: string | null
			name: string | null
			createdAt: Date
			updatedAt: Date
			role: user_role // Assuming an enum for user roles
			avatar: string | null
			projectId: string | null
		} | null
	}
}

const IssueCard = ({ cardDetails }: CardProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: cardDetails.id,
		data: {
			type: "card",
			title: cardDetails.title,
			parent: cardDetails.status.toLowerCase(),
		},
	})
	const IssyeTypeIcon =
		cardDetails.type === "TASK"
			? "CheckSquareIcon"
			: cardDetails.type === "STORY"
				? "BookOpenText"
				: cardDetails.type === "SUBTASK"
					? "ListChecksIcon"
					: "Bug"
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
				"rounded-sm w-full cursor-pointer bg-neutral-100 dark:bg-opacity-10 dark:bg-red-300",
				isDragging && "opacity-50"
			)}
		>
			<Card
				className={clsx("w-full cursor-pointer ", isDragging && "opacity-50")}
			>
				<CardHeader>
					<CardTitle className="text-xl">{cardDetails.title}</CardTitle>
					<CardDescription className="text-gray-500 ">
						Due: {new Date(cardDetails.due_date).toDateString()}
					</CardDescription>
				</CardHeader>
				{/* <CardContent>
					<Badge className="bg-red-500 text-white text-sm">High Priority</Badge>
					<p className="mt-4 line-clamp-4">{cardDetails.description}</p>
				</CardContent> */}
				<CardFooter className="w-full flex justify-between">
					<div className="flex items-center space-x-2 rounded-md bg-secondary p-1 text-xs">
						{cardDetails.type === "TASK" ? (
							<>
								<CheckSquareIcon className="w-4 h-4 text-primary" />
								<span>TASK-{cardDetails.task_number}</span>
							</>
						) : cardDetails.type === "STORY" ? (
							<>
								<BookOpenText className="w-4 h-4 text-primary" />
								<span>TASK-{cardDetails.task_number}</span>
							</>
						) : cardDetails.type === "SUBTASK" ? (
							<>
								<ListChecksIcon className="w-4 h-4 text-primary" />
								<span>TASK-{cardDetails.task_number}</span>
							</>
						) : (
							<>
								<Bug className="w-4 h-4 text-primary" />
								<span>TASK-{cardDetails.task_number}</span>
							</>
						)}
					</div>
					<div className="inline-flex items-center rounded-md border border-primary px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
						{cardDetails.labels ?? "Bug"}
					</div>{" "}
				</CardFooter>
			</Card>
		</div>
	)
}

export default IssueCard
