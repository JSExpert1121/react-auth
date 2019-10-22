import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface IEllipsisProps {
    fontSize?: string;
    maxLines?: number;
    hidden?: boolean;
}

const useStyles = (props: IEllipsisProps) => makeStyles((theme: Theme) => ({
    ellipsis: {
        display: '-webkit-box',
        maxHeight: `calc(${props.maxLines} * ${1.5} * ${props.fontSize})`,
        lineHeight: '1.5',
        visibility: !!props.hidden ? 'hidden' : 'visible',
        fontSize: props.fontSize,
        '-webkitLineClamp': props.maxLines,
        '-webkitBoxOrient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}));

const EllipsisText: React.FC<IEllipsisProps> = (props) => {
    const { children, fontSize, maxLines, hidden } = props;
    let realSize = fontSize || '1rem';
    let realLines = maxLines || 2;

    const classes = useStyles({ fontSize: realSize, maxLines: realLines, hidden })({});
    return (
        <span className={classes.ellipsis}>
            {children}
        </span>
    );
};

export default EllipsisText;
