export enum issue_status {
	NEW,
	ACTIVE,
	RESOLVED,
	CLOSED,
}

export enum IssueType {
	BUG,
	STORY,
	TASK,
	SUBTASK,
}

export enum IssueLabels {
	Design,
	Development,
	DevOps,
	FrontEnd,
	Backend,
}

export interface Issue {
	id: string

	title: string
	description: string

	created_by: string
	user_id: string
	created_at: Date
	updated_at: Date

	type: IssueType
	status: issue_status
	labels: IssueLabels
	story_points: number
	original_estimate: number
	time_completed: number
	due_date: Date
	priority: number
}
