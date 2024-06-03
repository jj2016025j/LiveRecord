
import { VerifyStatusNum } from '@/utils/enums';
import { CSSProperties } from 'react';

interface IVerifyStatusProps {
	status?: VerifyStatusNum,
}

const VerifyStatus: React.FunctionComponent<IVerifyStatusProps> = (props) => {
	const { status } = props || {};

	const baseStyle: CSSProperties = {
		textAlign: 'center',
		borderRadius: '20px',
		width: '70px',
		color: 'white',
	};

	const styles: { [key: string]: CSSProperties } = {
		Verifing: {
			...baseStyle,
			backgroundColor: 'orange',
		},
		Pass: {
			...baseStyle,
			backgroundColor: 'green'
		},
		Fail: {
			...baseStyle,
			backgroundColor: 'red'
		}
	};

	if (status === VerifyStatusNum.Pass) {
		return <div style={styles.Pass}>已通過</div>;
	} else if (status === VerifyStatusNum.Fail) {
		return <div style={styles.Fail}>不通過</div>;
	} else if (status === VerifyStatusNum.Verifing) {
		return <div style={styles.Verifing}>審核中</div>;
	} else {
		return <div style={styles.Verifing}>未知</div>;
	}
};

export default VerifyStatus;
