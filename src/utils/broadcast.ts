import { notification } from "antd"

export const successCast = (description: null | undefined | string | number) => {
	notification.success({
		message: '(APEC) Success !!',
		description,
		duration: 3,
		placement: 'topRight',
	});
}

export const errorCast = (description: null | undefined | string | number) => {
	notification.error({
		message: '(APEC) Warnning!!',
		description,
		duration: 4,
		placement: 'bottomRight',
	})
}
