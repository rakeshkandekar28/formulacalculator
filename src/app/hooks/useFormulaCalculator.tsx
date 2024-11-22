import * as React from 'react';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
// import { render } from 'katex'; // Import KaTeX render function

// Custom hook for managing formula and variables
export const useFormulaCalculator = () => {
	const [formula, setFormula] = React.useState<string>('');
	const [variables, setVariables] = React.useState<{ [key: string]: number }>({});
	const [result, setResult] = React.useState<number | null>(null);
	const [error, setError] = React.useState<string | null>(null);

	// Load saved formula from local storage on component mount
	React.useEffect(() => {
		const savedFormula = localStorage.getItem('savedFormula');
		if (savedFormula) {
			setFormula(savedFormula);
		}
	}, []);

	// Update variables based on the formula
	React.useEffect(
		() => {
			const detectedVariables = formula.match(/[a-zA-Z]+/g);
			const uniqueVariables = detectedVariables ? Array.from(new Set(detectedVariables)) : [];
			const newVariables: { [key: string]: number } = {};

			uniqueVariables.forEach((varName) => {
				newVariables[varName] = variables[varName] || 0; // Initialize to 0 if not set
			});

			// Only update state if new variables differ from current
			if (JSON.stringify(newVariables) !== JSON.stringify(variables)) {
				setVariables(newVariables);
			}
		},
		[formula]
	);

	// ... existing calculateResult, tokenize, toRPN, evaluateRPN functions ...
	// Function to calculate the result
	const calculateResult = React.useCallback(
		(formula: string, vars: { [key: string]: number }): number => {
			const substitutedFormula = formula.replace(/([a-zA-Z]+)(?=\()/g, (match) => {
				if (['sin', 'cos', 'tan', 'log'].includes(match)) {
					return match; // Keep the function as is
				} else if (vars[match] !== undefined) {
					return vars[match].toString(); // Substitute variable with its value
				} else {
					return '0'; // Default to 0 if variable is not defined
				}
			});

			const finalFormula = substitutedFormula.replace(/[a-zA-Z]+/g, (match) => {
				return vars[match] !== undefined ? vars[match].toString() : '0';
			});

			try {
				setError(null);
				const tokens = tokenize(finalFormula);
				const rpn = toRPN(tokens);
				return evaluateRPN(rpn);
			} catch (error) {
				setError('Invalid formula. Please check your input.'); // Set error message
				return 0; // Return 0 or handle error as needed
			}
		},
		[]
	);

	// Tokenize the expression
	const tokenize = (expr: string): string[] => {
		const regex = /\s*([()+\-*/^]|sin|cos|tan|log|\d+\.?\d*)\s*/g; // Updated regex to include functions
		const tokens: string[] = [];
		let match;

		while ((match = regex.exec(expr)) !== null) {
			if (match[1]) {
				tokens.push(match[1]);
			}
		}

		return tokens;
	};

	// Convert infix expression to RPN (Reverse Polish Notation)
	const toRPN = (tokens: string[]): string[] => {
		const output: string[] = [];
		const operators: string[] = [];
		const precedence: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

		tokens.forEach((token) => {
			if (!isNaN(Number(token))) {
				output.push(token); // If it's a number, add to output
			} else if (['sin', 'cos', 'tan', 'log'].includes(token)) {
				operators.push(token); // Push function to stack
			} else if (token === '(') {
				operators.push(token); // Push '(' to stack
			} else if (token === ')') {
				while (operators.length && operators[operators.length - 1] !== '(') {
					output.push(operators.pop()!);
				}
				operators.pop(); // Pop the '('
			} else if (precedence[token]) {
				while (
					operators.length &&
					precedence[operators[operators.length - 1]] >= precedence[token]
				) {
					output.push(operators.pop()!);
				}
				operators.push(token); // Push the operator
			}
		});

		while (operators.length) {
			output.push(operators.pop()!);
		}

		return output;
	};

	// Evaluate RPN expression
	const evaluateRPN = (tokens: string[]): number => {
		const stack: number[] = [];

		tokens.forEach((token) => {
			if (!isNaN(Number(token))) {
				stack.push(Number(token)); // Push number to stack
			} else if (['sin', 'cos', 'tan', 'log'].includes(token)) {
				const b = stack.pop()!; // For functions, only one argument is needed
				switch (token) {
					case 'sin':
						stack.push(Math.sin(b)); // Evaluate sine
						break;
					case 'cos':
						stack.push(Math.cos(b)); // Evaluate cosine
						break;
					case 'tan':
						stack.push(Math.tan(b)); // Evaluate tangent
						break;
					case 'log':
						stack.push(Math.log(b)); // Evaluate natural logarithm
						break;
					default:
						throw new Error(`Unknown operator: ${token}`); // Handle unknown operators
				}
			} else {
				const b = stack.pop()!;
				const a = stack.pop()!;
				switch (token) {
					case '+':
						stack.push(a + b);
						break;
					case '-':
						stack.push(a - b);
						break;
					case '*':
						stack.push(a * b);
						break;
					case '/':
						if (b === 0) {
							throw new Error('Division by zero'); // Handle division by zero
						}
						stack.push(a / b);
						break;
					case '^':
						stack.push(Math.pow(a, b));
						break;
					default:
						throw new Error(`Unknown operator: ${token}`); // Handle unknown operators
				}
			}
		});

		return stack.pop()!;
	};

	return {
		formula,
		setFormula,
		variables,
		setVariables,
		result,
		setResult,
		error,
		setError,
		saveFormula: () => {
			localStorage.setItem('savedFormula', formula);
			setError('Formula saved successfully, When you revisit site you will get this formula.'); // Feedback message
		},
		calculateResult
	};
};
