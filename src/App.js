import { useReducer } from 'react';
import DigButton from './DigButton';
import OpButton from './OpButton';
import './App.css';

export const ACTIONS = {
	ADD: 'add',
	CLEAR: 'clear',
	DELETE: 'delete',
	OPERATION: 'operation',
	EVAL: 'evaluate',
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case ACTIONS.ADD:
			if (state.overwrite) {
				return {
					...state,
					currentOp: payload.digit,
					overwrite: false,
				};
			}
			if (payload.digit === '0' && state.currentOp === '0') {
				return state;
			}
			if (payload.digit === '.' && state.currentOp.includes('.')) {
				return state;
			}
			return {
				...state,
				currentOp: `${state.currentOp || ''}${payload.digit}`,
			};
		case ACTIONS.DELETE:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOp: null,
				};
			}
			if (state.currentOp == null) {
				return state;
			}
			if (state.currentOp.length === 1) {
				return {
					...state,
					currentOp: null,
				};
			}
			return {
				...state,
				currentOp: state.currentOp.slice(0, -1),
			};
		case ACTIONS.OPERATION:
			if (state.currentOp == null && state.previousOp == null) {
				return state;
			}
			if (state.currentOp == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}
			if (state.previousOp == null) {
				return {
					...state,
					operation: payload.operation,
					previousOp: state.currentOp,
					currentOp: null,
				};
			}
			return {
				...state,
				previousOp: evaluate(state),
				operation: payload.operation,
				currentOp: null,
			};
		case ACTIONS.EVAL:
			if (
				state.operation == null ||
				state.currentOp == null ||
				state.previousOp == null
			) {
				return state;
			}
			return {
				...state,
				overwrite: true,
				previousOp: null,
				operation: null,
				currentOp: evaluate(state),
			};
		case ACTIONS.CLEAR:
			return {};
	}
};

const evaluate = ({ currentOp, previousOp, operation }) => {
	const prev = parseFloat(previousOp);
	const current = parseFloat(currentOp);
	if (isNaN(prev) || isNaN(current)) return '';
	let computation = '';
	switch (operation) {
		case '+':
			computation = prev + current;
			break;
		case '-':
			computation = prev - current;
			break;
		case '*':
			computation = prev * current;
			break;
		case '÷':
			computation = prev / current;
			break;
	}
	return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
	maximumFractionDigits: 0,
});

const formatOp = (operand) => {
	if (operand == null) {
		return;
	}
	const [integer, decimal] = operand.split('.');
	if (decimal == null) {
		return INTEGER_FORMATTER.format(integer);
	}
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const App = () => {
	const [{ currentOp, previousOp, operation }, dispatch] = useReducer(
		reducer,
		{}
	);
	return (
		<div className='calc-grid'>
			<div className='output'>
				<div className='previous-op'>
					{formatOp(previousOp)} {operation}
				</div>
				<div className='current-op'>{formatOp(currentOp)}</div>
			</div>
			<button
				className='span-two'
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
			<OpButton operation='÷' dispatch={dispatch} />
			<DigButton digit='1' dispatch={dispatch} />
			<DigButton digit='2' dispatch={dispatch} />
			<DigButton digit='3' dispatch={dispatch} />
			<OpButton operation='*' dispatch={dispatch} />
			<DigButton digit='4' dispatch={dispatch} />
			<DigButton digit='5' dispatch={dispatch} />
			<DigButton digit='6' dispatch={dispatch} />
			<OpButton operation='+' dispatch={dispatch} />
			<DigButton digit='7' dispatch={dispatch} />
			<DigButton digit='8' dispatch={dispatch} />
			<DigButton digit='9' dispatch={dispatch} />
			<OpButton operation='-' dispatch={dispatch} />
			<DigButton digit='.' dispatch={dispatch} />
			<DigButton digit='0' dispatch={dispatch} />
			<button
				className='span-two'
				onClick={() => dispatch({ type: ACTIONS.EVAL })}>
				=
			</button>
		</div>
	);
};

export default App;
