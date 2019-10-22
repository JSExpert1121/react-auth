import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl/';

export interface ILanguageProviderProps {
    locale: string;
    messages: Record<string, Record<string, string>>;
}

export const LanguageProvider: React.FC<ILanguageProviderProps> = (props) => {
    return (
        <IntlProvider
            locale={props.locale}
            key={props.locale}
            messages={props.messages[props.locale]}
        >
            {props.children}
        </IntlProvider>
    );
}

const mapStateToProps = (state: any) => ({
    locale: state.global.locale
});

export default connect(mapStateToProps)(LanguageProvider);