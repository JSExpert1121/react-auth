import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import AppRouter from 'containers/router';
import LangProvider from 'containers/providers/LanguageProvider';

import theme from 'config/theme.config';
import { translationMessages } from 'config/i18n.config';
import configureStore from 'store/config';


const store = configureStore();

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<LangProvider messages={translationMessages}>
				<BrowserRouter>
					<ThemeProvider theme={theme}>
						<AppRouter />
					</ThemeProvider>
				</BrowserRouter>
			</LangProvider>
		</Provider>
	);
}

export default App;
