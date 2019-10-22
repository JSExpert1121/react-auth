import React from 'react';
import Box from '@material-ui/core/Box';
import ConfirmDialog, { IConfirmDialogProps } from 'components/Dialog/ConfirmDialog';

export interface withConfirmProps {
    showConfirm: (title: string, msg: string, onYes: () => void, cancel: boolean) => void;
    hideConfirm: () => void;
}

const withConfirm = <P extends object>(Component: React.ComponentType<P>) => {

    return class extends React.Component<P, IConfirmDialogProps> {
        constructor(props) {
            super(props);

            this.state = {
                open: false,
                title: 'Confirm',
                onYes: undefined,
                onCancel: this.hideConfirm,
                message: '',
            }
        }

        showConfirm = (title, msg, onYes, cancel) => {
            this.setState({
                open: true,
                title,
                message: msg,
                onYes,
                onCancel: cancel ? this.hideConfirm : undefined
            });
        }

        hideConfirm = () => {
            this.setState({ open: false });
        }

        render() {

            return (
                <Box>
                    <Component
                        showConfirm={this.showConfirm}
                        hideConfirm={this.hideConfirm}
                        {...this.props}
                    />
                    <ConfirmDialog
                        open={this.state.open}
                        title={this.state.title}
                        onYes={this.state.onYes}
                        onCancel={this.state.onCancel}
                        message={this.state.message}
                    />
                </Box>
            )
        }
    }
}

export default withConfirm;