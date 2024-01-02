"use client"
import moment from "moment"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
moment.locale("en-GB")
//momentLocalizer(moment);
const localizer = momentLocalizer(moment)
const BigCalendar = () => {
	const resourceMap = [
		{ resourceId: 1, resourceTitle: "Board room" },
		{ resourceId: 2, resourceTitle: "Training room" },
		{ resourceId: 3, resourceTitle: "Meeting room 1" },
		{ resourceId: 4, resourceTitle: "Meeting room 2" },
	]
	const events = []
	const corporateTitlePrefixes = [
		"Strategic",
		"Executive",
		"Q1",
		"Q2",
		"Q3",
		"Q4",
		"Annual",
		"Bi-Weekly",
		"Monthly",
		"Client",
		"Project",
		"Budget",
		"Marketing",
		"Sales",
		"Product",
		"Development",
		"Team",
		"Performance",
		"Review",
		"Goal Setting",
		"Feedback",
		"Brainstorming",
		"Planning",
		"Retrospective",
		"Alignment",
		"Training",
		"Workshop",
		"Demo",
		"Launch",
		"Milestone",
	]
	const corporateTitleSuffixes = [
		"Meeting",
		"Review",
		"Sync",
		"Call",
		"Presentation",
		"Discussion",
		"Plan",
		"Strategy",
		"Alignment",
		"Workshop",
		"Training",
		"Brainstorming",
		"Retrospective",
		"Demo",
		"Launch",
		"Milestone",
		"Celebration",
	]

	const today = new Date()

	for (let i = 0; i < 25; i++) {
		const randomPrefixIndex = Math.floor(
			Math.random() * corporateTitlePrefixes.length
		)
		const randomSuffixIndex = Math.floor(
			Math.random() * corporateTitleSuffixes.length
		)
		const title = `${corporateTitlePrefixes[randomPrefixIndex]} ${corporateTitleSuffixes[randomSuffixIndex]}`

		events.push({
			id: i,
			title: title,
			start: new Date(today.getTime() + i * 2 * 24 * 60 * 60 * 1000), // Vary start dates
			end: new Date(today.getTime() + (i + 1) * 2 * 24 * 60 * 60 * 1000), // End follows start
			resourceId: Math.floor(Math.random() * 5) + 1, // Assign random resource IDs
		})
	}

	return (
		<div className="w-full  h-[calc(100vh-10rem)]">
			<Calendar
				selectable
				localizer={localizer}
				events={events}
				defaultView={Views.MONTH}
				views={[Views.DAY, Views.WEEK, Views.MONTH]}
				resources={resourceMap}
				resourceIdAccessor="resourceId"
				resourceTitleAccessor="resourceTitle"
			/>
		</div>
	)
}

export default BigCalendar
