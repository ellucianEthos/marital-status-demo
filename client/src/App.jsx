import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HomeContainer from './components/HomeContainer';


class App extends Component {
	render() {

		const theme = createMuiTheme({
			palette: {
				type: 'dark',
			},
			typography: {
				useNextVariants: true,
			},
		});

		return (
			<React.Fragment>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
					<HomeContainer />
				</MuiThemeProvider>
			</React.Fragment>
		);
	}
}

export default App;
