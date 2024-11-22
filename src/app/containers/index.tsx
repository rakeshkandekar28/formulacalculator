import * as React from 'react';
import { useFormulaCalculator } from '../hooks/useFormulaCalculator';
import { FormulaInput } from 'app/components/FormulaInput';
import { LaTeXRenderer } from 'app/components/LaTeXRenderer';
import { VariableInputs } from 'app/components/VariableInputs';
import { ResultDisplay } from 'app/components/ResultDisplay';
import styles from '../style/style.module.css';
// Main Component
export const FormulaCalculator: React.FC = () => {
	const {
		formula,
		setFormula,
		variables,
		setVariables,
		result,
		setResult,
		error,
		setError,
		saveFormula,
		calculateResult
	} = useFormulaCalculator();

	// Calculate result when variables change
	React.useEffect(
		() => {
			if (formula) {
				const allVariablesDefined = Object.keys(variables).every((varName) =>
					formula.includes(varName)
				);
				if (!allVariablesDefined) {
					setError(
						'Some variables are undefined. Please define all variables used in the formula.'
					);
					setResult(null);
					return;
				}
				try {
					const calculatedResult = calculateResult(formula, variables);
					setResult(calculatedResult || 0);
					// setError(null);
				} catch (error) {
					setError('Error calculating result. Please check your formula.');
				}
			}
		},
		[variables, formula, calculateResult]
	);

	return (
		<div className="container calculator-container">
			<h1 className="text-left">
				<span className={styles.pageHeader}>Formula Calculator</span>
			</h1>
			<LaTeXRenderer latex={formula} setError={setError} />
			<FormulaInput formula={formula} setFormula={setFormula} saveFormula={saveFormula} />
			<VariableInputs variables={variables} setVariables={setVariables} />
			<ResultDisplay result={result} error={error} />
		</div>
	);
};
