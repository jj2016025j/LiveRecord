import { LoginProps } from "@/api";

type SubmitLoginOptions = {
	userName: string;
	password: string;
	counterId: string;
}

const useSubmitLogin = (
	login: (props: LoginProps) => void
) => {
	const handleSubmitLogin = (values: SubmitLoginOptions) => {

		const { userName, password, counterId } = values;
		const loginProps: LoginProps={
			userName,
			password,
			cashRegisterUid: counterId,
		}
		login(loginProps);
	}

	return handleSubmitLogin;
}

export { useSubmitLogin };
export type { SubmitLoginOptions };