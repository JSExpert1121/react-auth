/**
 * @name SignupPage
 * @description Page for user registration. email/name/password/phone
 * @version 2.0 - Change terms and conditons, and layout of both pages
 * @author Darko
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

// material ui
import Box from '@material-ui/core/Box';

// i18n
import { injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.auth';

// signup pages
import SignupPage1 from './Page1';
import SignupPage2 from './Page2';

// actions & apis & types
import * as GlobalActions from 'store/actions/global';
import * as UserActions from 'store/actions/user';
import * as MemberApi from 'service/member';
import { TACItem } from 'types/user';


export interface ISignupPageProps extends RouteComponentProps {
    signup: (email: string, pass: string, name: string, code: string, phone: string, agrees: Array<any>) => Promise<void>;
    setTitle: (title: string) => void;
    refreshToken: () => Promise<void>;
    intl: IntlShape;
}

interface ISignupPageState {
    email: string;
    name: string;
    password: string;
    confirm: string;
    countryCode: string;
    phoneNo: string;
    phoneVerified: boolean;
    agrees: Array<any>;
    TAC: TACItem[];
    page: number;
    isBusy: boolean;
}

export class SignupPage extends React.Component<ISignupPageProps, ISignupPageState> {

    constructor(props: Readonly<ISignupPageProps>) {
        super(props);

        this.state = {
            email: '',
            name: '',
            password: '',
            confirm: '',
            countryCode: '',
            phoneNo: '',
            phoneVerified: false,
            agrees: [],
            TAC: [],
            page: 0,
            isBusy: false
        }
    }

    componentDidMount() {
        const { setTitle, intl } = this.props;
        setTitle(intl.formatMessage(messages.signupTitle));
        this.downloadTAC('USER');
    }

    downloadTAC = async (scope: string) => {
        try {
            const data: TACItem[] = await MemberApi.getTAC(scope);
            this.setState({ TAC: data.filter(item => item.enabled) });
        } catch (error) {
            console.log('SignupPage.CDM: ', error);
            this.setState({ TAC: [] });
        }
    }

    handleNext = (email: string, name: string, password: string, confirm: string, countryCode: string, phoneNo: string, phoneVerified: boolean) => {
        this.setState({
            email, name, password, confirm, countryCode, phoneNo, phoneVerified,
            page: 1
        });
    }

    handleBack = () => {
        this.setState({ page: 0 });
    }

    handleSignup = async (agrees: Array<any>) => {
        const { email, name, password, countryCode, phoneNo } = this.state;
        const { signup, history, refreshToken } = this.props;
        try {
            await signup(email, password, name, countryCode, phoneNo, agrees);
            refreshToken();
            history.push('/user/dashborad');
            return true;
        } catch (error) {
            console.log('Signup.Signup: ', error);
            return false;
        }
    }

    public render() {
        const { page, TAC } = this.state;
        return (
            <Box style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {page === 0 && (
                    <SignupPage1 goNext={this.handleNext} />
                )}
                {page === 1 && (
                    <SignupPage2 TAC={TAC} goBack={this.handleBack} signup={this.handleSignup} />
                )}
            </Box>
        );
    }
}

const mapDispatchToProps = (dispatch: any) => ({
    setTitle: (title: string) => dispatch(GlobalActions.setTitle(title)),
    signup: (email: string, pass: string, name: string, code: string, phone: string, agrees: Array<any>) => dispatch(UserActions.signup(email, pass, name, code, phone, agrees)),
    refreshToken: () => dispatch(UserActions.refreshToken())
});

export default injectIntl(connect(undefined, mapDispatchToProps)(SignupPage));