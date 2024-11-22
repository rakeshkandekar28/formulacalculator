import * as React from 'react';
import { Route, Switch } from 'react-router';
import { FormulaCalculator } from 'app/containers/index';
import { hot } from 'react-hot-loader';
export const App = hot(module)(() => (
	<Switch>
		<Route path="/" component={FormulaCalculator} />
	</Switch>
));
