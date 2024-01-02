import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../ui/button"
import { Calendar } from "../../ui/calendar"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select"
import { Textarea } from "../../ui/textarea"
import { trpc } from "@/app/_trpc/client"
import { useToast } from "../../ui/use-toast"

const formSchema = z.object({
	title: z
		.string({
			required_error: "Title should be entered",
		})
		.min(2, {
			message: "Title should be atleast 2 characters",
		}),
	description: z
		.string({
			required_error: "Description should be entered",
		})
		.min(10),
	issue_type: z.enum(["BUG", "STORY", "TASK", "SUBTASK"]),
	original_estimate: z
		.string({ required_error: "Give an estimate on this task" })
		.transform((v) => Number(v) || 0),
	due_date: z.date({
		required_error: "Due Date for this issue is required.",
	}),
	priority: z.string().transform((v) => Number(v) || 1),
	label: z.enum([
		"Design",
		"Development",
		"DevOps",
		"Frontend",
		"Backend",
		"Documentation",
		"Feature",
	]),
})

type NewIssueFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<NewIssueFormValues> = {
	issue_type: "BUG",
}
const CreateNewIssueForm = ({
	projectId,
	refetch,
}: {
	projectId: string
	refetch: () => void
}) => {
	const form = useForm<NewIssueFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: "onChange",
	})
	const { toast } = useToast()
	const { mutate: CreateIssue, isLoading } = trpc.issue.createIssue.useMutation(
		{
			onSuccess: (issue) => {
				toast({
					title: "New Issue created successfully",
					description: "Issue created successful",
				})
				refetch()
			},
		}
	)

	const onSubmit = (data: NewIssueFormValues) => {
		CreateIssue({
			projectId: projectId,
			title: data.title,
			description: data.description,
			issue_type: data.issue_type,
			original_estimate: data.original_estimate,
			due_date: new Date(data.due_date),
			priority: data.priority,
			label: data.label,
		})
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="my-5">
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Title of the new issue item" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="my-5">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Description of the new issue item"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="issue_type"
					render={({ field }) => (
						<FormItem className="my-5">
							<FormLabel>Type of the issue</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a type of the issue" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="BUG">BUG</SelectItem>
									<SelectItem value="STORY">STORY</SelectItem>
									<SelectItem value="TASK">TASK</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="original_estimate"
					render={({ field }) => (
						<FormItem className="my-5">
							<FormLabel>Original Estimate</FormLabel>
							<FormControl>
								<Input
									placeholder="Add an estimate for this task in hours"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="priority"
					render={({ field }) => (
						<FormItem className="my-5">
							<FormLabel>Priority</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a priority of the issue" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="1">Critical</SelectItem>
									<SelectItem value="2">Urgent</SelectItem>
									<SelectItem value="3">High</SelectItem>
									<SelectItem value="4">Medium</SelectItem>
									<SelectItem value="5">Low</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="due_date"
					render={({ field }) => (
						<FormItem className="my-5">
							<div className="flex flex-col gap-y-2">
								<FormLabel>Due Date</FormLabel>
								<FormControl>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[350px] align-text-top font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														`${new Date(field.value).toDateString()}`
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												disabled={(date) => date < new Date()}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="label"
					render={({ field }) => (
						<FormItem className="my-5">
							<FormLabel>Priority</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a label of the issue" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Design">Design</SelectItem>
									<SelectItem value="Development">Development</SelectItem>
									<SelectItem value="DevOps">DevOps</SelectItem>
									<SelectItem value="Frontend">Frontend</SelectItem>
									<SelectItem value="Backend">Backend</SelectItem>
									<SelectItem value="Documentation">Documentation</SelectItem>
									<SelectItem value="Feature">Feature</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Create New Issue</Button>
			</form>
		</Form>
	)
}

export default CreateNewIssueForm
