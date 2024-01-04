import React from "react"

import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Image from "next/image"

import Link from "next/link"
import { Gem, User } from "lucide-react"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import db from "@/db"
interface UserAccountNavProps {
	email: string | undefined
	name: string
	userId: string | null
}
const UserAccountNav = async ({ email, userId, name }: UserAccountNavProps) => {
	let user
	if (userId) {
		user = await db.user.findFirst({ where: { id: userId } })
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="overflow-visible">
				<Button className="rounded-full h-8 w-8 aspect-square">
					<Avatar className="relative w-8 h-8">
						{user?.avatar ? (
							<div className="relative aspect-square h-full w-full">
								<AvatarImage
									src={
										user?.avatar ||
										"https://api.dicebear.com/7.x/notionists/svg?seed=Max"
									}
									alt="profile picture"
									referrerPolicy="no-referrer"
								/>
							</div>
						) : (
							<AvatarFallback>
								<span className="sr-only">{name} </span>
								<User className="h-4 w-4" />
							</AvatarFallback>
						)}
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-0.5 leading-none">
						{name && <p className="font-medium text-sm t">{name} </p>}
						{email && (
							<p className="w-[200px] truncate text-xs text-muted-foreground">
								{email}{" "}
							</p>
						)}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/dashboard">Dashboard</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/pricing">
						Upgrade <Gem className="text-blue-500 h-4 w-4 ml-1.5" />{" "}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer">
					<LogoutLink>Log out</LogoutLink>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserAccountNav
