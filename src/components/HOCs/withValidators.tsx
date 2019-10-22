/**
 * @name withValidators
 * @description HOCs for validating text inputs in real-time
 * @version 1.0
 * @todo debounce?
 * @author Darko
 */
import React from 'react';

// material ui components & icons
import InputAdornment from '@material-ui/core/InputAdornment';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// 3rd party libraries
import { MessageDescriptor, FormattedMessage } from 'react-intl';

// custom components
import { ValidateFunc } from 'helper/validators';

// custom types and interfaces
type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
export interface ValidatorParam {
    validator: ValidateFunc | ((txt: string) => ValidateFunc);
    message: string | MessageDescriptor;
}

// component styles
const useStyles = makeStyles((theme: Theme) => ({
    error: {
        padding: theme.spacing(0.5, 1),
        color: theme.palette.error.dark
    },
    icon: {
        color: green[600]
    }
}));

/**
 * @name withValidators
 * @description HOC for validate input fields according to its validators
 * @param funcs Array of vaidation functions
 */
const withValidators = (params: ValidatorParam[]) => (Component: React.ComponentType<any>) => {

    const CustomInput: React.FC<any> = props => {

        const [changed, setChanged] = React.useState(false);
        /**
         * @name handleChangeEvent
         * @description Run validators against the input value
         * @param event HTML input element change event object(Synthetic event)
         */
        const handleChangeEvent = async (event: InputChangeEvent) => {
            if (!changed) setChanged(true);

            const { handleChange, compare } = props;
            const value = event.target.value;
            let valid = true;

            const len = params.length;
            for (let i = 0; i < len; i++) {
                const param = params[i];
                if (compare && typeof param.validator(compare) === 'function') {
                    // In cases of matching validators, validator(string) returns ValidatorFunc function.
                    // Matching target is passed via component props
                    const func = param.validator(compare) as ValidateFunc;
                    valid = await func(value);
                    if (!valid) {
                        handleChange(value, param.message);
                        return;
                    }
                } else {
                    const func = param.validator as ValidateFunc;
                    valid = await func(value);
                    if (!valid) {
                        handleChange(value, param.message);
                        return;
                    }
                }
            }

            // In case of valid input
            handleChange(value);
        }

        const { helperText, message, handleChange, ...rest } = props;
        const classes = useStyles({});
        const invalid = (!!message);
        const end = (invalid) ? undefined : <InputAdornment position="end"><CheckCircleIcon fontSize='small' className={classes.icon} /></InputAdornment>

        return (
            <Component
                onChange={handleChangeEvent}
                variant='outlined'
                margin='dense'
                fullWidth
                required
                InputProps={{ endAdornment: changed && end }}
                helperText={invalid ? <FormattedMessage {...message} /> : helperText}
                error={invalid}
                {...rest}
            />
        )
    }

    return CustomInput;
}

export default withValidators;