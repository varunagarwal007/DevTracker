export const IssueStatus = [
	{
		title: "NEW",
		key: "new",
		datamapper: "new",
		items: [
			{
				id: "1-item",
				title: "First",
				parent: "new",
			},
			{
				id: "2-item",
				title: "second",
				parent: "new",
			},
		],
	},
	{
		title: "ACTIVE",
		key: "active",
		datamapper: "active",
		items: [
			{
				id: "5-item",
				title: "Fifth",
				parent: "active",
			},
			{
				id: "6-item",
				title: "Sixth",
				parent: "active",
			},
		],
	},
	{
		title: "RESOLVED",
		key: "resolved",
		datamapper: "resolved",
		items: [
			{
				id: "3-item",
				title: "Third",
				parent: "resolved",
			},
			{
				id: "4-item",
				title: "Fourth",
				parent: "resolved",
			},
		],
	},
	{
		title: "CLOSED",
		key: "closed",
		datamapper: "closed",
		items: [],
	},
]
