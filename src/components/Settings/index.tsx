"use client"
import { trpc } from "@/app/_trpc/client"
import { Plus, Send } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"

const Settings = ({ projectId }: { projectId: string }) => {
	const [newUserEmail, setNewUserEmail] = useState<string>("")
	const { data: projectMembers } = trpc.project.getProjectSettings.useQuery(
		{
			id: projectId,
		},
		{ staleTime: Infinity }
	)

	const isAdmin = true
	const { mutate, isLoading: isAdding } =
		trpc.project.addUserToProject.useMutation()
	return (
		<div className="w-full ">
			<div className="py-2 h-20 w-full">
				<h3 className="text-2xl font-bold text-primary">Project Settings </h3>
				<p className="text-muted-foreground">
					Change the settings of your project{" "}
					<span className="font-bold text-primary ">
						{projectMembers?.title}
					</span>{" "}
					here.
				</p>
			</div>
			<div className="flex flex-col max-w-4xl m-auto my-8">
				<form className="w-full">
					<Label className="my-8" htmlFor="project_type">
						Your Project Type:
					</Label>
					<Select>
						<SelectTrigger
							className="mt-4"
							id="project_type"
							defaultValue={"Software"}
						>
							<SelectValue
								defaultValue={"Software"}
								placeholder="Change your project type"
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Software">Software</SelectItem>
							<SelectItem value="Design">Design</SelectItem>
							<SelectItem value="Mangement">Management</SelectItem>
							<SelectItem value="Marketing">Marketing</SelectItem>
							<SelectItem value="Business">Business</SelectItem>
						</SelectContent>
					</Select>
				</form>
				<div className=" w-full min-h-[25rem] rounded-xl border-2 my-12 border-dashed border-primary flex flex-col">
					<div className="m-4 flex flex-row items-center justify-between">
						<div className="text-muted-foreground text-3xl font-bold">
							Your Project Members
						</div>
						<Dialog>
							<DialogTrigger asChild disabled={!isAdmin}>
								<Button>
									<Plus className="w-5 h-5 space-x-2" />
									Add Project Members
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Add Project Members</DialogTitle>
									<DialogDescription>
										Add new project members to your project.
									</DialogDescription>
								</DialogHeader>
								<div className="flex items-center space-x-2">
									<div className="grid flex-1 gap-2">
										<Label htmlFor="new_member" className="sr-only">
											Link
										</Label>
										<Input
											id="new_member"
											placeholder="Enter email of the new member"
											onChange={(e) => setNewUserEmail(e.target.value)}
										/>
									</div>
									<Button
										className="px-3"
										onClick={() =>
											mutate({ project_id: projectId, email: newUserEmail })
										}
									>
										<Send className="w-4 h-4" />
									</Button>
								</div>
								<DialogFooter className="sm:justify-start">
									<DialogClose asChild>
										<Button type="button" variant="secondary">
											Close
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
					{projectMembers?.teamMembers.length !== 0 ? (
						<div className="grid grid-cols-3 gap-4 m-4">
							{projectMembers?.teamMembers.map((m, i) => (
								<div className="rounded-lg bg-secondary min-h-16" key={i}>
									<div className="flex flex-row p-4 items-center justify-between">
										<Avatar className="w-9 h-9 aspect-square">
											<AvatarImage src={m.avatar!} />
											<AvatarFallback>User</AvatarFallback>
										</Avatar>
										<span className="truncate"> {m.email} </span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex justify-center items-center">
							Add new memebers to this project{" "}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Settings
