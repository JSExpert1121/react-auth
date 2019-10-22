import * as React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
// import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// i18n
import { injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.auth';
import globalMsgs from 'translations/messages/global';

// custom components
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import CustomCheckbox from 'components/Checkboxs/Check';
import { TACItem } from 'types/user';
import logo from 'assets/images/logo.png';
import logoText from 'assets/images/logo_text.png';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 960,
        height: 640,
        padding: theme.spacing(2, 2)
    },
    left: {
        display: 'flex',
        paddingRight: theme.spacing(4),
        flexDirection: 'column',
        maxHeight: '100%'
    },
    right: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    height100: {
        height: '100%'
    },
    title: {
        padding: theme.spacing(0, 1, 1, 2),
        fontSize: '1.3rem',
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 300,
    },
    summary: {
        color: theme.palette.primary.main,
        paddingLeft: theme.spacing(1),
        justifyContent: 'flex-start'
    },
    line: {
        width: 'calc(100% - 40px)',
        margin: '0 8px 0 16px',
        color: 'rgba(0, 0, 0, 0.6)'
    },
    mandesc: {
        paddingTop: theme.spacing(1)
    },
    more: {
        boxShadow: 'none',
        width: '100%',
        padding: 8,
        margin: '0 !important',
        paddingRight: 0,
        flex: 1
    },
    details: {
        width: '100%',
        fontSize: '1rem',
    },
    submit: {
        margin: theme.spacing(1, 0),
        minWidth: 140,
        padding: theme.spacing(1.25),
        borderRadius: 8
    },
    busy: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
}));

interface ISignupPage2Props {
    intl: IntlShape;
    TAC: TACItem[];
    goBack: () => void;
    signup: (agrees: Array<any>) => Promise<boolean>;
}

export const SignupPage2: React.FC<ISignupPage2Props> = (props) => {

    const { TAC, intl } = props;
    const classes = useStyles({});
    const [agreed, setAgreed] = React.useState(false);
    const [optAgrees, setOptAgrees] = React.useState<number[]>([]);
    const [busy, setBusy] = React.useState(false);
    const [currentTAC, setCurTAC] = React.useState<TACItem | undefined>(undefined);
    const [showTAC, setShowTAC] = React.useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    if (!TAC) return <Box></Box>;

    const manTAC = TAC.filter(item => item.mandatory);
    const optTAC = TAC.filter(item => !item.mandatory);
    let agreeMsg = intl.formatMessage(messages.agreement);

    const signup = async () => {
        const agrees = manTAC.map(item => ({
            articlesId: item.id,
            agreed: true
        }));

        const opts = optAgrees.map(id => ({
            articlesId: id,
            agreed: true
        }));

        setBusy(true);
        const res = await props.signup([...agrees, ...opts]);
        if (!res) setBusy(false);
    }

    const onClickTac = (item: TACItem) => {
        setCurTAC(item);
        setShowTAC(true);
    }

    // checkbox for each optional TAC
    const changeOpt = (id: number) => {
        const idx = optAgrees.indexOf(id);
        if (idx < 0) {
            optAgrees.push(id);
        } else {
            optAgrees.splice(idx, 1);
        }

        setOptAgrees([...optAgrees]);
    }

    // checkbox for all optional TACs
    const allAgreed = optTAC.length === optAgrees.length;
    const changeAllOpt = () => {
        if (allAgreed) {
            setOptAgrees([]);
        } else {
            setOptAgrees(optTAC.map(item => item.id));
        }
    }

    const closeDialog = () => {
        setShowTAC(false);
    }

    // mandatory TAC items
    let manTacItem = undefined;
    if (manTAC.length > 0) {
        if (agreeMsg.startsWith('and')) {
            manTacItem = (
                <Typography className={classes.mandesc}>
                    {intl.formatMessage(messages.agreeMandatory) + ' ' + agreeMsg}
                    {manTAC.map((item, index) => (
                        <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                            {item.name + (index === (manTAC.length - 1) ? '' : ', ')}
                        </Link>
                    ))}
                </Typography>
            )
        } else {
            manTacItem = (
                <Typography className={classes.mandesc}>
                    {intl.formatMessage(messages.agreeMandatory) + ' '}
                    {manTAC.map((item, index) => (
                        <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                            {item.name + (index === (manTAC.length - 1) ? '' : ', ')}
                        </Link>
                    ))}
                    {agreeMsg}
                </Typography>
            )
        }
    } else {
        agreeMsg = '';
    }

    // optional TAC items
    let optTacItem = undefined;
    if (optTAC.length > 0) {
        if (agreeMsg.startsWith('and')) {
            const msg = agreeMsg.slice(4);
            optTacItem = (
                <Typography style={{ paddingTop: 8 }}>
                    {intl.formatMessage(messages.agreeOptional) + ' ' + msg}
                    {optTAC.map((item, index) => (
                        <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                            {item.name + (index === (optTAC.length - 1) ? '' : ', ')}
                        </Link>
                    ))}
                </Typography>
            )
        } else {
            optTacItem = (
                <Typography style={{ paddingTop: 8 }}>
                    {intl.formatMessage(messages.agreeOptional) + ' '}
                    {optTAC.map((item, index) => (
                        <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                            {item.name + (index === (optTAC.length - 1) ? '' : ', ')}
                        </Link>
                    ))}
                    {agreeMsg}
                </Typography>
            )
        }
    }

    return (
        <Paper className={classes.root} id='terms-root' square>
            <CssBaseline />
            <Grid container className={classes.height100}>
                <Grid item xs={12} sm={7} className={classes.height100}>
                    <Box className={classes.left}>
                        <Box style={{ paddingTop: 16 }} id="signup-page2-title">
                            <img src={logoText} height={20} width='auto' alt='logo' style={{ paddingLeft: 16, marginBottom: 8 }} />
                            <Typography className={classes.title} id='terms-conditions-title'>
                                {intl.formatMessage(messages.tac)}
                            </Typography>
                        </Box>
                        <Box
                            id='signup-page2-man-tac'
                            style={{ padding: 8, maxHeight: 362, overflow: 'auto', scrollbarWidth: "thin" }}
                        >
                            <Typography style={{ padding: '0 8px' }}>
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {intl.formatMessage(messages.manDesc)}
                                {manTAC.map((item, index) => (
                                    <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                                        {item.name + (index === (manTAC.length - 1) ? '' : ', ')}
                                    </Link>
                                ))}
                            </Typography>
                        </Box>
                        {optTAC.length > 0 && (
                            <ExpansionPanel square className={classes.more}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="tacitem-content"
                                    id="tacitem-header"
                                    className={classes.summary}
                                >
                                    <Typography>
                                        {intl.formatMessage(messages.optTacTitle)}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{ maxHeight: 120, overflow: 'auto' }}>
                                    <Box className={classes.details}>
                                        {intl.formatMessage(messages.optDesc)}
                                        {optTAC.map((item, index) => {
                                            let optItem = undefined;
                                            if (agreeMsg.startsWith('and')) {
                                                optItem = (
                                                    <Typography style={{ paddingTop: 8 }}>
                                                        {agreeMsg.slice(4) + ' '}
                                                        <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                                                            {item.name}
                                                        </Link>
                                                    </Typography>
                                                )
                                            } else {
                                                optItem = (
                                                    <Typography style={{ paddingTop: 8 }}>
                                                        <Link key={item.id} style={{ cursor: 'pointer' }} onClick={() => onClickTac(item)}>
                                                            {item.name}
                                                        </Link>
                                                        {agreeMsg}
                                                    </Typography>
                                                )
                                            }

                                            return (
                                                <CustomCheckbox
                                                    key={item.id}
                                                    style={{ marginLeft: -8 }}
                                                    id={`tac-agree-checkbox-${item.id}`}
                                                    checked={optAgrees.includes(item.id)}
                                                    onChange={() => changeOpt(item.id)}
                                                    label={optItem}
                                                />
                                            )
                                        })}
                                    </Box>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )}
                        <hr className={classes.line} />
                        <Box id='terms-conditions-actions' style={{ padding: 8 }}>
                            {manTAC.length > 0 && (
                                <CustomCheckbox
                                    id='tac-agree-checkbox'
                                    checked={agreed}
                                    onChange={() => setAgreed(!agreed)}
                                    label={manTacItem}
                                />
                            )}
                            {optTAC.length > 0 && (
                                <CustomCheckbox
                                    id='tac-agree-checkbox'
                                    checked={allAgreed}
                                    onChange={changeAllOpt}
                                    label={optTacItem}
                                />
                            )}
                        </Box>
                        <Grid container style={{ padding: '0 0 0 16px' }}>
                            <Grid item xs={12}>
                                {<LinearProgress id='busy-indicator' className={classes.busy} style={{ visibility: busy ? 'visible' : 'hidden' }} />}
                            </Grid>
                            <Grid item xs style={{ alignItems: 'flex-end', display: 'flex', paddingBottom: 12 }}>
                                <Button
                                    id='button-back'
                                    type="submit"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={props.goBack}
                                >
                                    {intl.formatMessage(globalMsgs.back)}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    id='button-signup'
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={!agreed}
                                    onClick={signup}
                                >
                                    {intl.formatMessage(messages.signup)}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={5}>
                    {matches && (
                        <Box className={classes.right}>
                            <Box style={{ padding: '0 64px' }} id='signup-page2-rightbar'>
                                <img src={logo} alt={'lazy'} style={{ width: '100%', height: 'auto' }} />
                                <Typography style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: 32 }}>
                                    {'You can review Hit!T Terms and Conditions at any time in your profile page & opt out of any optional terms and conditions'}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>
            {currentTAC && (
                <ConfirmDialog
                    open={showTAC}
                    title={currentTAC.name}
                    message={
                        <span id='modal-content'>
                            {currentTAC.articles[0].content.split('\n').map((item, idx) => (
                                <span key={idx}>{item}<br /></span>
                            ))}
                        </span>
                    }
                    onYes={closeDialog}
                    ok={intl.formatMessage(globalMsgs.ok)}
                />
            )}
        </Paper>
    );
};

export default injectIntl(SignupPage2);
