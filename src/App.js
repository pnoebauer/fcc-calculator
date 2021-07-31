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
		this.state = {displayedValue: '0'};
	}

	handleNumberClick = e => {
		console.log(e.currentTarget.id, e.currentTarget.value, 'clicked');
		const clickedDigit = e.currentTarget.value;

		this.setState(prevState => ({
			displayedValue:
				prevState.displayedValue === '0'
					? clickedDigit
					: prevState.displayedValue + clickedDigit,
		}));
	};

	render() {
		const {displayedValue} = this.state;

		return (
			// Calculator
			<div className='calculator'>
				{/* Display  */}
				<div className='calculator-display'>
					<h1 id='display'>{displayedValue}</h1>
				</div>
				{/* Buttons  */}
				<div className='calculator-buttons'>
					<button className='operator' value='+' id='add'>
						+
					</button>
					<button className='operator' value='-' id='subtract'>
						-
					</button>
					<button className='operator' value='*' id='multiply'>
						×
					</button>
					<button className='operator' value='/' id='divide'>
						÷
					</button>
					{numberSequence.map(number => {
						return CreateNumberButton(number, this.handleNumberClick);
					})}

					<button className='decimal' id='decimal' value='.'>
						.
					</button>
					{CreateNumberButton(0, this.handleNumberClick)}
					<button className='clear' id='clear'>
						C
					</button>
					<button className='equal-sign operator' id='equals' value='='>
						=
					</button>
				</div>
			</div>
		);
	}
}

export default App;
