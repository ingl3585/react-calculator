import { ACTIONS } from './App';

export default function DigButton({ dispatch, digit }) {
	return (
		<button onClick={() => dispatch({ type: ACTIONS.ADD, payload: { digit } })}>
			{digit}
		</button>
	);
}
