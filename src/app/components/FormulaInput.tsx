import * as React from 'react';
// FormulaInput Component
export const FormulaInput: React.FC<{ formula: string; setFormula: (formula: string) => void; saveFormula: () => void; }> = React.memo(({ formula, setFormula, saveFormula }) => {
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormula(e.target.value);
    }, [setFormula]);

    return (
        <div className="input-group mb-3">
            <input 
                type="text" 
                value={formula} 
                onChange={handleChange} 
                placeholder="Enter formula (e.g., 2 + 3 * x)" 
                className="form-control formula-input" 
            />
            <div className="input-group-append">
                <button onClick={saveFormula} className="save-button btn btn-primary">Save Formula</button>
            </div>
        </div>
    );
});

