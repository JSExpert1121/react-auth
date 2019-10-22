import * as React from 'react';

// material ui components
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) => ({
    avatar: {
        padding: theme.spacing(0.5),
        color: 'white',
        backgroundColor: theme.palette.primary.dark,
        width: 32,
        height: 32
    }
}));

interface IProfileButtonProps {
    name: string;
    avatar?: string;
}

const ProfileButton: React.FunctionComponent<IProfileButtonProps> = (props) => {

    const { name, avatar } = props;
    const classes = useStyles({});
    return (
        <React.Fragment>
            {avatar && <Avatar className={classes.avatar} alt={name} src={avatar}></Avatar>}
            {!avatar && <Avatar className={classes.avatar}>{name.toUpperCase().slice(0, 1)}</Avatar>}
        </React.Fragment>
    );
};

export default ProfileButton;
