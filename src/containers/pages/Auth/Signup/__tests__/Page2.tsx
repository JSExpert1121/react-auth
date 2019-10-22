/* disable tslint */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider } from "react-intl";
import { act } from 'react-dom/test-utils';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';

import Page2 from '../Page2';
import CustomCheckbox from 'components/Checkboxs/Check';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import logoText from 'assets/images/logo_text.png';
import logo from 'assets/images/logo.png';

jest.mock('service/member');
configure({ adapter: new Adapter() });

const TAC = [
    {
        id: 0,
        name: 'TAC 1',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 100, content: 'Terms and conditions 1', datePublished: '2910', state: '' }],
        enabled: true,
        mandatory: true,
        agreed: false
    },
    {
        id: 1,
        name: 'TAC 2',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 101, content: 'Terms and conditions 2', datePublished: '2911', state: '' }],
        enabled: true,
        mandatory: true,
        agreed: false
    },
    {
        id: 1000,
        name: 'Test TAC 1',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 2000, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.', datePublished: '2922', state: '' }],
        mandatory: false,
        enabled: true,
        agreed: false
    },
    {
        id: 1001,
        name: 'Test TAC 2',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 2001, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.', datePublished: '2922', state: '' }],
        mandatory: false,
        enabled: true,
        agreed: false
    },
    {
        id: 1002,
        name: 'Test TAC 3',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 2002, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.', datePublished: '2922', state: '' }],
        mandatory: false,
        enabled: true,
        agreed: false
    }
];

// strange warning message ignore
const mockConsoleMethod = (realConsoleMethod) => {
    const ignoredMessages = ['test was not wrapped in act(...)'];
    return (message, ...args) => {
        const containsMessage = ignoredMessages.some(ignoredMessage => message.includes(ignoredMessage))
        if (!containsMessage) {
            realConsoleMethod(message, ...args);
        }
    }
}

console.warn = jest.fn(mockConsoleMethod(console.warn));
console.error = jest.fn(mockConsoleMethod(console.error));

const initTest = width => {
    Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: width
    });
    window.matchMedia = jest.fn().mockImplementation(
        query => {
            return {
                matches: width >= theme.breakpoints.values.sm ? true : false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn()
            };
        }
    );
    const height = Math.round((width * 9) / 16);
    return { width, height };
};

describe('containers/pages/auth/signup/page2 UI components without TAC', () => {

    const goNext = jest.fn();
    const signup = jest.fn();
    const mount = createMount();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    <Page2 goBack={goNext} signup={signup} TAC={undefined} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('without tac', () => {
        expect(wrapper.find(Page2).find(Box)).toHaveLength(1);
        expect(wrapper.find(Page2).find(Box).props().children).toBeFalsy();
    });
});

describe('containers/pages/auth/signup/page2 UI components with TACs', () => {

    const goBack = jest.fn();
    const signup = jest.fn();
    const mount = createMount();

    initTest(theme.breakpoints.values.sm);
    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    <Page2 goBack={goBack} signup={signup} TAC={TAC} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('UI components', done => {

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Page2).find(Paper)).toHaveLength(2);    // including expansion panel

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.props().square).toBe(true);
            expect(page.find(Grid)).toHaveLength(7);

            expect(page.find(Grid).first().props().container).toBe(true);
            expect(page.find(Grid).at(1).props().item).toBe(true);

            // title bar
            expect(page.find(Grid).at(1).find('#signup-page2-title').first().find('img')).toHaveLength(1);
            expect(page.find(Grid).at(1).find('#signup-page2-title').first().find('img')).toHaveLength(1);
            expect(page.find(Grid).at(1).find('#signup-page2-title').first().find('img').props().src).toEqual(logoText);
            expect(page.find(Grid).at(1).find('#signup-page2-title').first().find(Typography)).toHaveLength(1);
            expect(page.find(Grid).at(1).find('#signup-page2-title').first().find(Typography).props().children).toEqual('Terms and Conditions');

            // mandatory tacs
            expect(page.find(Grid).at(1).find('#signup-page2-man-tac').first().find(Typography).first().find(Link)).toHaveLength(2);

            // optional tacs
            expect(page.find(Grid).at(1).find(ExpansionPanel)).toHaveLength(1);
            expect(wrapper.find(Page2).find(ExpansionPanelDetails).find(Link)).toHaveLength(3);
            expect(wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox)).toHaveLength(3);


            // horizontal line
            expect(page.find(Grid).at(1).find('hr')).toHaveLength(1);

            // actions
            expect(page.find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox)).toHaveLength(2);
            expect(page.find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).first().props().checked).toBe(false);
            expect(page.find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).last().props().checked).toBe(false);

            // progress bar and buttons
            expect(page.find(Grid).at(2).props().container).toBe(true);
            expect(page.find(Grid).at(3).props().children.type).toEqual(LinearProgress);
            expect(page.find(Grid).at(4).props().item).toBe(true);
            expect(page.find(Grid).at(4).find(Button)).toHaveLength(1);
            expect(page.find(Grid).at(4).find(Button).props().children).toEqual('BACK');
            expect(page.find(Grid).at(5).props().item).toBe(true);
            expect(page.find(Grid).at(5).find(Button)).toHaveLength(1);
            expect(page.find(Grid).at(5).find(Button).props().children).toEqual('Sign Up');

            // right panel
            expect(page.find(Grid).at(6).props().item).toBe(true);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().props().children).toHaveLength(2);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().find('img')).toHaveLength(1);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().find('img').props().src).toEqual(logo);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().find(Typography)).toHaveLength(1);

            expect(page.find(ConfirmDialog)).toHaveLength(0);
            done();
        });
    });
});

describe('containers/pages/auth/signup/page2 UI components with TACs for Korean', () => {

    const goBack = jest.fn();
    const signup = jest.fn();
    const mount = createMount();

    initTest(theme.breakpoints.values.sm);
    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='ko' messages={translationMessages.ko}>
                <ThemeProvider theme={theme}>
                    <Page2 goBack={goBack} signup={signup} TAC={TAC} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('UI components', done => {

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Page2).find(Paper)).toHaveLength(2);    // including expansion panel

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.props().square).toBe(true);
            expect(page.find(Grid)).toHaveLength(7);

            expect(page.find(Grid).first().props().container).toBe(true);
            expect(page.find(Grid).at(1).props().item).toBe(true);

            // title bar
            expect(page.find(Grid).at(1).find('#signup-page2-title').first().find(Typography).props().children).toEqual('이용 약관');

            // mandatory tacs
            expect(page.find(Grid).at(1).find('#signup-page2-man-tac').first().find(Typography).first().find(Link)).toHaveLength(2);

            // optional tacs
            expect(page.find(Grid).at(1).find(ExpansionPanel)).toHaveLength(1);
            expect(wrapper.find(Page2).find(ExpansionPanelDetails).find(Link)).toHaveLength(3);
            expect(wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox)).toHaveLength(3);


            // horizontal line
            expect(page.find(Grid).at(1).find('hr')).toHaveLength(1);

            // actions
            expect(page.find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox)).toHaveLength(2);
            expect(page.find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).first().props().checked).toBe(false);
            expect(page.find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).last().props().checked).toBe(false);

            // progress bar and buttons
            expect(page.find(Grid).at(2).props().container).toBe(true);
            expect(page.find(Grid).at(3).props().children.type).toEqual(LinearProgress);
            expect(page.find(Grid).at(4).props().item).toBe(true);
            expect(page.find(Grid).at(4).find(Button)).toHaveLength(1);
            expect(page.find(Grid).at(4).find(Button).props().children).toEqual('뒤로');
            expect(page.find(Grid).at(5).props().item).toBe(true);
            expect(page.find(Grid).at(5).find(Button)).toHaveLength(1);
            expect(page.find(Grid).at(5).find(Button).props().children).toEqual('회원가입');

            // right panel
            expect(page.find(Grid).at(6).props().item).toBe(true);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().props().children).toHaveLength(2);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().find('img')).toHaveLength(1);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().find('img').props().src).toEqual(logo);
            expect(page.find(Grid).at(6).find('#signup-page2-rightbar').first().find(Typography)).toHaveLength(1);

            expect(page.find(ConfirmDialog)).toHaveLength(0);
            done();
        });
    });
});

describe('containers/pages/auth/signup/page2 TAC interaction', () => {

    const goBack = jest.fn();
    const signup = jest.fn();
    signup.mockResolvedValueOnce(true).mockResolvedValue(false);
    const mount = createMount();

    initTest(theme.breakpoints.values.sm);
    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    <Page2 goBack={goBack} signup={signup} TAC={TAC} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('click tac item', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find('#signup-page2-man-tac').first().find(Typography).first().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-1', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('click man-tac item on actions', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).first().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-2', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('click opt-tac item on actions', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).last().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-3', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('click opt-tac item on expansion panels', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find(ExpansionPanelDetails).first().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-4', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('check change (optional tac)', done => {
        act(() => {
            wrapper.find(Page2).find(ExpansionPanelDetails).find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.last().props().checked).toBe(true);
            done();
        });
    });

    test('check change again (optional tac)', done => {
        act(() => {
            wrapper.find(Page2).find(ExpansionPanelDetails).find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.last().props().checked).toBe(false);
            done();
        });
    });

    test('check all optTacs', done => {
        act(() => {
            wrapper.find(Page2).find('#terms-conditions-actions').find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.at(0).props().checked).toBe(true);
            expect(optChecks.at(1).props().checked).toBe(true);
            expect(optChecks.at(2).props().checked).toBe(true);
            done();
        });
    });

    test('check all optTacs again', done => {
        act(() => {
            wrapper.find(Page2).find('#terms-conditions-actions').find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.at(0).props().checked).toBe(false);
            expect(optChecks.at(1).props().checked).toBe(false);
            expect(optChecks.at(2).props().checked).toBe(false);
            done();
        });
    });

    test('check man-tacs', done => {
        act(() => {
            wrapper.find(Page2).find('#terms-conditions-actions').find(Checkbox).first().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const manChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(manChecks.at(0).props().checked).toBe(false);
            done();
        });
    });

    test('goBack action', done => {
        act(() => {
            wrapper.find(Page2).find('#button-back').last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(goBack).toBeCalled();
            done();
        })
    });

    test('check change (optional tac)', done => {
        act(() => {
            wrapper.find(Page2).find(ExpansionPanelDetails).find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.last().props().checked).toBe(true);
            done();
        });
    });

    test('signup action', done => {
        act(() => {
            wrapper.find(Page2).find('#button-signup').last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(signup).toHaveBeenCalledWith([
                { agreed: true, articlesId: 0 },
                { agreed: true, articlesId: 1 },
                { agreed: true, articlesId: 1002 }
            ]);
            expect(wrapper.find(Page2).find(LinearProgress).props().style).toEqual({ visibility: 'visible' });
            done();
        })
    });

    test('signup action', done => {
        act(() => {
            wrapper.find(Page2).find('#button-signup').last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(signup).toHaveBeenCalledWith([
                { agreed: true, articlesId: 0 },
                { agreed: true, articlesId: 1 },
                { agreed: true, articlesId: 1002 }
            ]);
            expect(wrapper.find(Page2).find(LinearProgress).props().style).toEqual({ visibility: 'hidden' });
            done();
        })
    });
});

describe('containers/pages/auth/signup/page2 TAC interaction for Korean', () => {

    const goBack = jest.fn();
    const signup = jest.fn();
    const mount = createMount();

    initTest(theme.breakpoints.values.sm);
    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='ko' messages={translationMessages.ko}>
                <ThemeProvider theme={theme}>
                    <Page2 goBack={goBack} signup={signup} TAC={TAC} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('click tac item', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find('#signup-page2-man-tac').first().find(Typography).first().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-1', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('click man-tac item on actions', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).first().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-2', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('click opt-tac item on actions', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find('#terms-conditions-actions').first().find(CustomCheckbox).last().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-3', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('click opt-tac item on expansion panels', done => {

        act(() => {
            wrapper.find(Page2).find(Grid).at(1).find(ExpansionPanelDetails).first().find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog)).toHaveLength(1);
            expect(page.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('close-dialog-4', done => {
        act(() => {
            wrapper.find(ConfirmDialog).props().onYes();
        });

        setImmediate(() => {
            wrapper.update();

            const page = wrapper.find(Page2).find(Paper).first();
            expect(page.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('check change (optional tac)', done => {
        act(() => {
            wrapper.find(Page2).find(ExpansionPanelDetails).find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.last().props().checked).toBe(true);
            done();
        });
    });

    test('check change again (optional tac)', done => {
        act(() => {
            wrapper.find(Page2).find(ExpansionPanelDetails).find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.last().props().checked).toBe(false);
            done();
        });
    });

    test('check all optTacs', done => {
        act(() => {
            wrapper.find(Page2).find('#terms-conditions-actions').find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.at(0).props().checked).toBe(true);
            expect(optChecks.at(1).props().checked).toBe(true);
            expect(optChecks.at(2).props().checked).toBe(true);
            done();
        });
    });

    test('check all optTacs again', done => {
        act(() => {
            wrapper.find(Page2).find('#terms-conditions-actions').find(Checkbox).last().find('input').simulate('change');
        });

        setImmediate(() => {
            wrapper.update();

            const optChecks = wrapper.find(Page2).find(ExpansionPanelDetails).find(CustomCheckbox);
            expect(optChecks.at(0).props().checked).toBe(false);
            expect(optChecks.at(1).props().checked).toBe(false);
            expect(optChecks.at(2).props().checked).toBe(false);
            done();
        });
    });
});
