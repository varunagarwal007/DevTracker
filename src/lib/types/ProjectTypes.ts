import { string } from "zod"
import { Issue } from "./Issues"

enum projectTypes {
	software,
}
export type ProjectType = {
	Issuse: Pick<
		Issue,
		"id" | "created_by" | "title" | "description" | "due_date" | "priority"
	>[]
	id: string
	title: string
	description: string
	projectType: projectTypes
	userId: string
	totalIssues: number
	resolved_issues: number
	closed_issues: number
	active_issues: number
	new_issues: number
	picture: string
}
