interface SingleErrorSchedule {
	retry: number
	user_id: number
}

interface ErrorScheduleWithUser {
	id: number
	retry: number
	user_id: number
	email: string,
	firstname: string,
	lastname: string,
	local: string
}

export { SingleErrorSchedule, ErrorScheduleWithUser }
