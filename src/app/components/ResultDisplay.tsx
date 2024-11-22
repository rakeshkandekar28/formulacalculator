import * as React from 'react';

// ResultDisplay Component
export const ResultDisplay: React.FC<{ result: number | null; error: string | null }> = React.memo(
	({ result, error }) => {
		const displayResult = React.useMemo(
			() => {
				return result !== null ? result : 'Enter a formula';
			},
			[result]
		);

		return (
			<div>
				{error && <div className="error-message text-center">{error}</div>}
				<h4 className="text-center">Result: {displayResult}</h4>
			</div>
		);
	}
);
