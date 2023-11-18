export const getUserAvatar = () => {
	let seed = [
		"Tiger",
		"Abby",
		"Max",
		"Sugar",
		"Gracie",
		"Joe",
		"Sam",
		"Thomas",
		"Alexander",
		"Rosy",
		"Emily",
		"Buddy",
		"Gizmo",
		"Mimi",
		"Max",
		"Amy",
	]
	let i = Math.floor(Math.random() * seed.length)
	return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed[i]}`
}
