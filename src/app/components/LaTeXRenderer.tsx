import * as React from 'react';
import { render } from 'katex';
import useDebounce from 'app/hooks/useDebounce';

// LaTeXRenderer Component
export const LaTeXRenderer: React.FC<{
	latex: string;
	setError: (error: string | null) => void;
}> = React.memo(({ latex, setError }) => {
	const debouncedLatex = useDebounce(latex, 500); // Use the custom debounce hook

	React.useEffect(
		() => {
			const latexElement = document.getElementById('latex-output');
			if (latexElement) {
				try {
					render(debouncedLatex, latexElement, { throwOnError: false, output: 'mathml' });
					setError(null);
				} catch (error) {
					setError('Error rendering formula. Please check your input.');
				}
			}
		},
		[debouncedLatex, setError]
	);

	return <div id="latex-output" style={{ marginBottom: '10px' }} />;
});
