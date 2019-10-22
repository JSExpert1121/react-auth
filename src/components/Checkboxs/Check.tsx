import * as React from 'react';

import Box from '@material-ui/core/Box';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';


interface ICheckBoxProps extends CheckboxProps {
    label: React.ReactNode;
}

const CheckBox: React.FunctionComponent<ICheckBoxProps> = (props) => {

    const { label, ...rest } = props;

    return (
        <Box style={{ display: 'flex' }}>
            <Box>
                <Checkbox {...rest} />
            </Box>
            {label}
        </Box>
    );
};

export default CheckBox;
