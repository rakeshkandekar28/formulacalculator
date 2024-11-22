# Code Assesment

frontend-task-ascendeum as per the code Assesment. 


## Contains

Certainly! Below is a detailed explanation of the `FormulaCalculator` component in your `index.tsx` file, along with the purpose of each section of the code.

### File Overview
The `FormulaCalculator` component is a React functional component that allows users to input mathematical formulas, define variables, and calculate results based on those formulas. It also supports saving and loading formulas from local storage and rendering LaTeX output.

### Code Explanation

```typescript
import * as React from 'react';
import './style.css';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for rendering LaTeX
import { render } from 'katex'; // Import KaTeX render function for LaTeX rendering
```
- **Imports**: The component imports React and necessary styles. It also imports KaTeX for rendering LaTeX formulas.

```typescript
export const FormulaCalculator: React.FC = () => {
    const [formula, setFormula] = React.useState<string>(''); // State for the formula input
    const [variables, setVariables] = React.useState<{ [key: string]: number }>({}); // State for variables
    const [result, setResult] = React.useState<number | null>(null); // State for calculation result
    const [error, setError] = React.useState<string | null>(null); // State for error messages
    const [latex, setLatex] = React.useState<string>(''); // State for LaTeX output
```
- **State Variables**: The component uses several state variables to manage the formula input, variables, calculation results, error messages, and LaTeX output.

```typescript
    // Load saved formula from local storage on component mount
    React.useEffect(() => {
        const savedFormula = localStorage.getItem('savedFormula');
        if (savedFormula) {
            setFormula(savedFormula); // Set the formula state to the saved formula
        }
    }, []);
```
- **Loading Saved Formula**: This `useEffect` hook runs once when the component mounts, checking local storage for a saved formula and setting it in the state if found.

```typescript
    // Update variables based on the formula
    React.useEffect(() => {
        const detectedVariables = formula.match(/[a-zA-Z]+/g); // Detect variable names in the formula
        const uniqueVariables = detectedVariables ? Array.from(new Set(detectedVariables)) : []; // Get unique variable names
        const newVariables: { [key: string]: number } = {};
        
        uniqueVariables.forEach(varName => {
            newVariables[varName] = variables[varName] || 0; // Initialize to 0 if not set
        });
        
        setVariables(newVariables); // Update state with new variables
    }, [formula]);
```
- **Updating Variables**: This `useEffect` hook updates the `variables` state whenever the `formula` changes. It detects variable names in the formula and initializes them to 0 if they are not already defined.

```typescript
    // Function to calculate the result
    const calculateResult = (formula: string, vars: { [key: string]: number }): number => {
        
        
        // Substitute variables in the formula
        const substitutedFormula = formula.replace(/([a-zA-Z]+)(?=\()/g, (match) => {
            // Check if the match is a function
            if (['sin', 'cos', 'tan', 'log'].includes(match)) {
                return match; // Keep the function as is
            } else if (vars[match] !== undefined) {
                return vars[match].toString(); // Substitute variable with its value
            } else {
                return '0'; // Default to 0 if variable is not defined
            }
        });
```
- **Calculating Result**: The `calculateResult` function takes a formula and a set of variables, substituting variable names with their values. It handles functions like `sin`, `cos`, `tan`, and `log` separately.

```typescript
        // Substitute variables that are not functions
        const finalFormula = substitutedFormula.replace(/[a-zA-Z]+/g, (match) => {
            return vars[match] !== undefined ? vars[match].toString() : '0';
        });
```
- **Final Formula Preparation**: This line substitutes any remaining variable names in the formula with their values, defaulting to 0 if they are not defined.

```typescript
        try {
            const tokens = tokenize(finalFormula); // Tokenize the final formula
            const rpn = toRPN(tokens); // Convert tokens to Reverse Polish Notation
            return evaluateRPN(rpn); // Evaluate the RPN expression
        } catch (error) {
            
            setError('Invalid formula. Please check your input.'); // Set error message
            return 0; // Return 0 or handle error as needed
        }
    };
```
- **Evaluating the Formula**: The function tokenizes the final formula, converts it to Reverse Polish Notation (RPN), and evaluates it. If an error occurs, it logs the error and sets an error message.

```typescript
    // Tokenize the expression
    const tokenize = (expr: string): string[] => {
        const regex = /\s*([()+\-*/^]|sin|cos|tan|log|\d+\.?\d*)\s*/g; // Regex to match numbers and operators
        const tokens: string[] = [];
        let match;

        while ((match = regex.exec(expr)) !== null) {
            if (match[1]) {
                tokens.push(match[1]); // Add matched tokens to the array
            }
        }

        return tokens; // Return the array of tokens
    };
```
- **Tokenization**: The `tokenize` function splits the expression into tokens (numbers, operators, and functions) using a regular expression.

```typescript
// Convert infix expression to RPN (Reverse Polish Notation)
const toRPN = (tokens: string[]): string[] => {
    const output: string[] = [];
    const operators: string[] = [];
    const precedence: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

    tokens.forEach(token => {
        if (!isNaN(Number(token))) {
            output.push(token); // If it's a number, add to output
        } else if (['sin', 'cos', 'tan', 'log'].includes(token)) {
            operators.push(token); // Push function to stack
        } else if (token === '(') {
            operators.push(token); // Push '(' to stack
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop()!); // Pop operators to output until '('
            }
            operators.pop(); // Pop the '('
        } else if (precedence[token]) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop()!); // Pop operators based on precedence
            }
            operators.push(token); // Push the operator
        }
    });

    while (operators.length) {
        output.push(operators.pop()!); // Pop remaining operators to output
    }

    return output; // Return the RPN output
};
```
- **Infix to RPN Conversion**: The `toRPN` function converts an infix expression (standard mathematical notation) to Reverse Polish Notation using the Shunting Yard algorithm.

```typescript
// Evaluate RPN expression
const evaluateRPN = (tokens: string[]): number => {
    const stack: number[] = [];

    tokens.forEach(token => {
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

    return stack.pop()!; // Return the final result
};
```
- **RPN Evaluation**: The `evaluateRPN` function evaluates the RPN expression using a stack. It handles both numbers and functions, performing calculations as needed.

```typescript
    // Handle input change for formula
    const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormula(e.target.value); // Update formula state
        setLatex(e.target.value); // Update LaTeX state
        setError(null); // Clear any previous error
    };
```
- **Formula Input Change**: This function updates the formula state when the user types in the input field and clears any previous error messages.

```typescript
    // Handle variable input change
    const handleVariableChange = (varName: string, value: number) => {
        setVariables(prev => ({ ...prev, [varName]: value })); // Update the specific variable
    };
```
- **Variable Input Change**: This function updates the value of a specific variable when the user changes its input.

```typescript
    // Calculate result when variables change
    React.useEffect(() => {
        if (formula) {
            const allVariablesDefined = Object.keys(variables).every(varName => formula.includes(varName));
            if (!allVariablesDefined) {
                setError('Some variables are undefined. Please define all variables used in the formula.');
                setResult(null);
                return;
            }
            try {
                const calculatedResult = calculateResult(formula, variables);
                setResult(calculatedResult || 0);
                setError(null); // Clear any previous error
            } catch (error) {
                
                setError('Error calculating result. Please check your formula.'); // Set error message
            }
        }
    }, [variables, formula]);
```
- **Result Calculation on Variable Change**: This `useEffect` hook recalculates the result whenever the `variables` or `formula` changes. It checks if all variables are defined and updates the result or sets an error message accordingly.

```typescript
    // Render LaTeX when formula changes
    React.useEffect(() => {
        if (latex) {
            const latexElement = document.getElementById('latex-output');

            if (latexElement) {
                try {
                    render(latex, latexElement, { throwOnError: false, output: 'mathml' }); // Attempt to render LaTeX
                    setError(null);
                } catch (error) {
                    
                    setError('Error rendering formula. Please check your input.'); // Set error message
                }
            }
        }
    }, [latex]);
```
- **LaTeX Rendering**: This `useEffect` hook renders the LaTeX output whenever the `latex` state changes. It attempts to render the LaTeX and sets an error message if it fails.

```typescript
    // Save formula to local storage
    const saveFormula = () => {
        localStorage.setItem('savedFormula', formula); // Save the current formula to local storage
        setError('Formula saved successfully! when you revisit you will get this formula'); // Feedback message
    };
```
- **Saving Formula**: This function saves the current formula to local storage and provides feedback to the user.

```typescript
    return (
        <div className="container calculator-container">
            <h1>Formula Calculator</h1>
            <div className='row'>
                <div className='col-md-12'>
                LaTex render: <div id="latex-output" style={{ marginBottom: '10px' }}></div> {/* LaTeX output */}
                </div>
            </div>
            
            <div className='row'>
                <div className='col-md-12'>
                    <div className="input-group mb-3">
                    <input 
                    type="text" 
                    value={formula} 
                    onChange={handleFormulaChange} 
                    placeholder="Enter formula (e.g., 2 + 3 * x)" 
                    className="form-control formula-input" 
                    />
                    <div className="input-group-append">
                    <button onClick={saveFormula} className="save-button btn btn-primary">Save Formula</button> {/* Save button */}
                    </div>
                </div>
            </div>
            
                <div className='col-md-12 text-center'>
                {error && <div className="error-message">{error}</div>} {/* Display error message */}
                </div>
            </div>
            
            <div className='row'>
                {Object.keys(variables).map(varName => (
                    <div className="col-md-6 col-12"  key={varName}>
                        <div className="variable-input form-group">
                            <label>{varName}: </label>
                            <input
                                type="number"
                                value={variables[varName]}
                                onChange={(e) => handleVariableChange(varName, parseFloat(e.target.value))} // Update variable value
                                className="variable-number-input form-control"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <h2>Result: {result !== null ? result : 'Enter a formula'}</h2>
        </div>
    );
};
```
- **Rendering the Component**: The return statement renders the component's UI, including:
  - A title and a section for displaying LaTeX output.
  - An input field for entering the formula and a button to save it.
  - A section for displaying error messages.
  - Input fields for each variable, allowing users to enter their values.
  - A display for the calculation result.

### Conclusion
The `FormulaCalculator` component is a comprehensive tool for inputting mathematical formulas, defining variables, and calculating results. It includes features for error handling, local storage, and LaTeX rendering, making it a robust solution for mathematical computations in a React application. If you have any specific questions or need further clarifications!




Create separate components for:
Formula input
LaTeX renderer
Variable inputs
Result display

Hooks:
Use a custom hook for managing the formula and variables.


Overview:
Custom Hook (useFormulaCalculator): Manages the state and logic related to the formula and variables.
Components: Each component handles a specific part of the UI:
FormulaInput: For entering the formula.
LaTeXRenderer: For rendering the LaTeX output.
VariableInputs: For managing variable inputs.
ResultDisplay: For displaying the result and any error messages.

## Installation

```
$ npm i
```

## Running

```
$ npm start
```

## Build

```
$ npm run build
```


## Format code (using [Prettier](https://github.com/prettier/prettier))

```
$ npm run prettier
```

