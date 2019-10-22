import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#3f51b5',
			dark: '#303f9f',
		},
		secondary: {
			light: '#0033EE',
			main: '#1100BB',
			contrastText: '#000000',
		},
		background: {
			default: '#FFF'
		}
	},
	typography: {
		fontFamily: "\"Noto Sans\", \"Noto Sans KR\", sans-serif"
	},
	overrides: {
		MuiAppBar: {
			colorPrimary: {
				color: '#111',
				backgroundColor: 'white'
			}
		},
		MuiContainer: {
			root: {
				padding: 0
			}
		},
		MuiBadge: {
			colorSecondary: {
				color: 'white'
			}
		},
		MuiExpansionPanel: {
			root: {
				margin: '8px 0',
				'&:before': {
					height: 0
				}
			}
		},
		MuiExpansionPanelSummary: {
			root: {
				padding: 0,
				'&:before': {
					height: 0
				}
			},
			content: {
				margin: 0,
				flexGrow: 0,
				'&.Mui-expanded': {
					margin: 0
				}
			}
		},
		MuiExpansionPanelDetails: {
			root: {
				padding: 8
			}
		}
	}
});

export default theme;
