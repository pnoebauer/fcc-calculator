import React from 'react';
import './App.css';

const numbers = [
	'zero',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
];

const numberSequence = [7, 8, 9, 4, 5, 6, 1, 2, 3];

const calculationMap = {
	'/': (firstNumber, secondNumber) => firstNumber / secondNumber,

	'*': (firstNumber, secondNumber) => firstNumber * secondNumber,

	'+': (firstNumber, secondNumber) => firstNumber + secondNumber,

	'-': (firstNumber, secondNumber) => firstNumber - secondNumber,

	'=': (firstNumber, secondNumber) => secondNumber,
};

// function to create a digit component
const CreateNumberButton = (digit, handleClick) => {
	return (
		<button value={String(digit)} id={numbers[digit]} onClick={handleClick} key={digit}>
			{digit}
		</button>
	);
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			displayedValue: '0',
			firstOperatorValue: '',
			activeOperator: null,
			awaitingNextNumber: false,
			signDisplayedValue: '+',
		};
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);
	}

	handleKeyDown = e => {
		if (e.key.toLowerCase() === 'c') {
			const clearButton = document.getElementById('clear');
			clearButton.classList.add('active');

			this.handleClearClick();
		}
		if (e.key.toLowerCase() === '.') {
			const decimalButton = document.getElementById('decimal');
			decimalButton.classList.add('active');

			this.handleDecimalClick();
		}
		if (e.key.match(/[0-9]/g)) {
			const numberButton = document.getElementById(numbers[Number(e.key)]);
			numberButton.classList.add('active');

			this.handleNumberClick(e);
		}
		if (e.key.match(/[/=*+-]/g)) {
			const operatorButton = document.getElementsByName(e.key)[0];
			operatorButton.classList.add('active');

			this.handleOperatorClick(e);
		}
	};

	handleKeyUp = e => {
		// const keyEl = document.getElementById(`${event.key.toUpperCase()}-key`);
		// keyEl.classList.remove('drum-pad-active');
		if (e.key.toLowerCase() === 'c') {
			const clearButton = document.getElementById('clear');
			clearButton.classList.remove('active');
		}
		if (e.key.toLowerCase() === '.') {
			const decimalButton = document.getElementById('decimal');
			decimalButton.classList.remove('active');
		}
		if (e.key.match(/[0-9]/g)) {
			const numberButton = document.getElementById(numbers[Number(e.key)]);
			numberButton.classList.remove('active');
		}
		if (e.key.match(/[/=*+-]/g)) {
			const operatorButton = document.getElementsByName(e.key)[0];
			operatorButton.classList.remove('active');
		}
	};

	handleNumberClick = e => {
		const clickedDigit = e.currentTarget.value || e.key;
		// console.log(clickedDigit);

		this.setState(prevState => ({
			displayedValue: prevState.awaitingNextNumber //has an operator been clicked ?
				? clickedDigit
				: prevState.displayedValue === '0' //is the displayedValue zero ? then overwrite it
				? clickedDigit
				: prevState.displayedValue + clickedDigit, //else add the digit to the current number
			awaitingNextNumber: false,
		}));
	};

	handleDecimalClick = () => {
		this.setState(prevState => ({
			displayedValue: prevState.awaitingNextNumber //has an operator been clicked ?
				? prevState.displayedValue
				: prevState.displayedValue.split('.').length > 1 ||
				  prevState.displayedValue === '-' //is there already a decimal ? or is there a minus
				? prevState.displayedValue
				: prevState.displayedValue + '.',
		}));
	};

	handleClearClick = () => {
		this.setState({
			displayedValue: '0',
			firstOperatorValue: '',
			activeOperator: null,
			awaitingNextNumber: false,
			signDisplayedValue: '+',
		});
	};

	handleOperatorClick = e => {
		if (this.state.displayedValue === '0') return;

		const clickedOperator = e.currentTarget.value || e.key;

		let displayedValue = this.state.displayedValue;

		// if any operator has been clicked before calculate the result
		if (this.state.activeOperator) {
			// console.log('active', this.state, this.handleCalculation());

			// if before * or / was clicked and right after a minus was clicked than do not calculate but set displayed value to -
			if (this.state.awaitingNextNumber) {
				if (
					clickedOperator === '-' &&
					(this.state.activeOperator === '*' || this.state.activeOperator === '/')
				) {
					this.setState(prevState => ({
						signDisplayedValue: prevState.signDisplayedValue === '+' ? '-' : '+',
					}));

					return;
				}

				this.setState({
					activeOperator: clickedOperator,
					signDisplayedValue: '+',
					awaitingNextNumber: true,
				});

				return;
			}

			displayedValue = this.handleCalculation();
		}

		this.setState({
			displayedValue,
			firstOperatorValue: displayedValue,
			activeOperator: clickedOperator,
			awaitingNextNumber: true,
			signDisplayedValue: '+',
		});
	};

	handleCalculation = () => {
		const {firstOperatorValue, activeOperator, displayedValue, signDisplayedValue} =
			this.state;

		return calculationMap[activeOperator](
			Number(firstOperatorValue),
			Number(signDisplayedValue + 1) * Number(displayedValue)
		);
	};

	render() {
		const {displayedValue} = this.state;

		return (
			<div className='calculator'>
				<div className='calculator-display'>
					<h1 id='display'>{displayedValue}</h1>
				</div>
				<div className='calculator-buttons'>
					<button
						className='operator'
						value='+'
						name='+'
						id='add'
						onClick={this.handleOperatorClick}
					>
						+
					</button>
					<button
						className='operator'
						value='-'
						name='-'
						id='subtract'
						onClick={this.handleOperatorClick}
					>
						-
					</button>
					<button
						className='operator'
						value='*'
						name='*'
						id='multiply'
						onClick={this.handleOperatorClick}
					>
						×
					</button>
					<button
						className='operator'
						value='/'
						name='/'
						id='divide'
						onClick={this.handleOperatorClick}
					>
						÷
					</button>
					{numberSequence.map(number =>
						CreateNumberButton(number, this.handleNumberClick)
					)}
					<button
						className='decimal'
						id='decimal'
						value='.'
						onClick={this.handleDecimalClick}
					>
						.
					</button>
					{CreateNumberButton(0, this.handleNumberClick)}
					<button className='clear' id='clear' onClick={this.handleClearClick}>
						C
					</button>
					<button
						className='equal-sign operator'
						id='equals'
						value='='
						name='='
						onClick={this.handleOperatorClick}
					>
						=
					</button>
				</div>
			</div>
		);
	}
}

export default App;
