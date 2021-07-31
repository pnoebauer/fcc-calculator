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
		<button value={String(digit)} id={numbers[digit]} onClick={handleClick}>
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
		};
	}

	handleNumberClick = e => {
		// console.log(
		// 	e.currentTarget.id,
		// 	e.currentTarget.value,
		// 	'clicked',
		// 	this.state.firstOperatorValue,
		// 	this.state.activeOperator
		// );
		const clickedDigit = e.currentTarget.value;

		this.setState(prevState => ({
			displayedValue: prevState.awaitingNextNumber //has an operator been clicked ?
				? clickedDigit
				: prevState.displayedValue === '0' //is the displayedValue zero ? then overwrite it
				? clickedDigit
				: prevState.displayedValue + clickedDigit, //else add the digit to the current number
			awaitingNextNumber: false,
		}));
	};

	handleDecimalClick = e => {
		// console.log(e.currentTarget.id, e.currentTarget.value, 'clicked decimal');
		const clickedDecimal = e.currentTarget.value;

		this.setState(prevState => ({
			displayedValue: prevState.awaitingNextNumber //has an operator been clicked ?
				? prevState.displayedValue
				: prevState.displayedValue.split('.').length > 1 //is there already a decimal ?
				? prevState.displayedValue
				: prevState.displayedValue + clickedDecimal,
		}));
	};

	handleClearClick = () => {
		this.setState({
			displayedValue: '0',
			firstOperatorValue: '',
			activeOperator: null,
			awaitingNextNumber: false,
		});
	};

	handleOperatorClick = e => {
		if (this.state.displayedValue === '0') return;

		let displayedValue = this.state.displayedValue;

		// if any operator has been clicked before calculate the result
		if (this.state.activeOperator) {
			// console.log(
			// 	'active',
			// 	this.state.activeOperator,
			// 	this.state.displayedValue,
			// 	this.state.firstOperatorValue,
			// 	this.handleCalculation()
			// );

			displayedValue = this.handleCalculation();
		}

		this.setState({
			displayedValue,
			firstOperatorValue: displayedValue,
			activeOperator: e.currentTarget.value,
			awaitingNextNumber: true,
		});
	};

	handleCalculation = () => {
		const {firstOperatorValue, activeOperator, displayedValue} = this.state;

		return calculationMap[activeOperator](
			Number(firstOperatorValue),
			Number(displayedValue)
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
						id='add'
						onClick={this.handleOperatorClick}
					>
						+
					</button>
					<button
						className='operator'
						value='-'
						id='subtract'
						onClick={this.handleOperatorClick}
					>
						-
					</button>
					<button
						className='operator'
						value='*'
						id='multiply'
						onClick={this.handleOperatorClick}
					>
						×
					</button>
					<button
						className='operator'
						value='/'
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
