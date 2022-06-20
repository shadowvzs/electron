import { makeStyles } from '@mui/styles';
import React from 'react';

interface ProgressBarProps {
    progress: number;
    title?: string;
}
const useStyles = makeStyles({
    root: {
        paddingTop: 16
    },
    title: {
        paddingBottom: 3,
        fontSize: 12
    },
    container: {
        position: 'relative',
        height: 20
    },
    percentage: {
        position: 'absolute',
        margin: 'auto',
        top: 3,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 12
    }
});

export const ProgressBar = ({ progress, title }: ProgressBarProps) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {title && (<p children={title} className={classes.title} />)}
            <div className={classes.container}>
                <progress max={100} value={progress} className="css-progressbar">
                    <div className="progress-bar">
                        <span style={{ width: `${progress}%` }}>{progress}%</span>
                    </div>
                </progress>
                <p
                    className={classes.percentage}
                    children={progress + '%'}
                />
            </div>
        </div>
    );
};