import {BrowserRouter as Router } from 'react-router-dom';
import {mount} from 'enzyme';

import App from './App';

describe('login function', () => {

    const app = <Router><App /></Router>;
    const wrapper = mount(app);
    const emailInput = wrapper.find('[data-test="email"]');
    const passwordInput = wrapper.find('[data-test="password"]');
    const loginSubmit = wrapper.find('[data-test="login-submit"]');
    const navlinkTransactions = wrapper.find('[data-test="navlink-transactions"]')
    const transactionsNotRenderedElement = wrapper.find('[data-test="transactions-not-rendered"]');
    const transactionsRenderedElement = wrapper.find('[data-test="transactions-rendered"]');

      test('renders transactions when correct email and password provided', () => {

        emailInput.simulate('change', {target: {value: 'stijnklijn@gmail.com'}})
        passwordInput.simulate('change', {target: {value: 'oostendo'}})
        loginSubmit.simulate('click', {preventDefault() {}});




        expect(transactionsRenderedElement).toHaveLength(1);
    })
})