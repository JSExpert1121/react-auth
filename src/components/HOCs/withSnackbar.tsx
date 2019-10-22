import React from 'react';
import CustomSnackbar, { ISnackbarProps } from 'components/Snackbar/CustomSnackbar';
import Box from '@material-ui/core/Box';

export interface withSnackbarProps {
    showMessage: (suc: boolean, msg: string) => void;
    hideMessage: () => void;
}

const withSnackbar = <P extends object = withSnackbarProps>(Component: React.ComponentType<P>) => {

    return class extends React.Component<P, ISnackbarProps> {
        constructor(props) {
            super(props);

            this.state = {
                showMessage: false,
                message: '',
                variant: 'success',
                handleClose: this.hideMessage
            }
        }

        showMessage = (suc, msg) => {
            this.setState({
                showMessage: true,
                message: msg,
                variant: suc ? 'success' : 'error',
            });
        }

        hideMessage = () => {
            this.setState({
                showMessage: false
            });
        }

        render() {

            return (
                <Box>
                    <Component
                        showMessage={this.showMessage}
                        hideMessage={this.hideMessage}
                        {...this.props}
                    />
                    <CustomSnackbar
                        open={this.state.showMessage}
                        variant={this.state.variant}
                        message={this.state.message}
                        handleClose={this.state.handleClose}
                    />
                </Box>
            )
        }
    }
}

export default withSnackbar;