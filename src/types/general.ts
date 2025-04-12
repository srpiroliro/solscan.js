export type ApiV2Response<T> = {
	success: boolean
	data: T[]
	errors?: {
		code: number
		message: string
	}
}
