import * as React from 'react';
// VariableInputs Component
export const VariableInputs: React.FC<{
	variables: { [key: string]: number };
	setVariables: (vars: { [key: string]: number }) => void;
}> = React.memo(({ variables, setVariables }) => (
	<div className="row">
		{Object.keys(variables).map((varName) => (
			<div className="col-md-6 col-12" key={varName}>
				<div className="variable-input form-group">
					<label>{varName}: </label>
					<input
						type="number"
						value={variables[varName]}
						// onChange={(e) => setVariables(prev => ({ ...prev, [varName]: parseFloat(e.target.value) }))}
						// onChange={(e) => setVariables((prev: { [key: string]: number }) => ({ ...prev, [varName]: parseFloat(e.target.value) }))}
						onChange={(e) => {
							const newValue = parseFloat(e.target.value);
							setVariables({ ...variables, [varName]: newValue });
						}}
						className="variable-number-input form-control"
					/>
				</div>
			</div>
		))}
	</div>
));
