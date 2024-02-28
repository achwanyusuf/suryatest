interface SingleUserSchedule {
	id: number
	local: string
	lastDate: string
	cursor: number
}

interface UpdateUserScheduleInput {
	cursor: number
	lastDate: string
}

export { SingleUserSchedule, UpdateUserScheduleInput }
