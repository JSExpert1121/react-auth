import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

// material ui components & icons
import Box from '@material-ui/core/Box';

// i18n
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.home';

// actions
import * as GlobalActions from 'store/actions/global';


interface IHomePageProps extends RouteComponentProps {
    setTitle: (title: string) => void;
    intl: IntlShape;
}

const HomePage: React.FC<IHomePageProps> = (props) => {

    const { setTitle, intl } = props;
    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.title));
    });

    return (
        <Box>
            <FormattedMessage {...messages.hello} />
        </Box>
    )
};

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => ({
    setTitle: (title: string) => dispatch(GlobalActions.setTitle(title)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HomePage));
