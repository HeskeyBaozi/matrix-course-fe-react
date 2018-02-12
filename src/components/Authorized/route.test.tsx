import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router, Switch } from 'react-router';
import AuthorizedRoute from './route';

const baseAuthority = [ 'student', 'TA', 'teacher' ];

const BeforeLogin = () => (
  <span>You need to login</span>
);
const AfterLogin = () => (
  <h1>Yes, you logged.</h1>
);

const MyBaseRoute = ({ current, memoryHistory }: { current: string, memoryHistory: any }) => (
  <Router history={ memoryHistory }>
    <Switch>
      <AuthorizedRoute
        current={ current }
        path={ '/login' }
        component={ BeforeLogin }
        authority={ [ 'guest' ] }
        redirectPath={ '/' }
      />
      <AuthorizedRoute
        current={ current }
        path={ '/' }
        component={ AfterLogin }
        authority={ baseAuthority }
        redirectPath={ '/login' }
      />
    </Switch>
  </Router>
);

it('should renders without crashing', () => {
  const history = createMemoryHistory({
    initialEntries: [ '/' ],
    initialIndex: 0
  });
  shallow(<MyBaseRoute current={ 'guest' } memoryHistory={ history }/>);
});

it('should render no-login route before login', () => {
  const history = createMemoryHistory({
    initialEntries: [ '/' ],
    initialIndex: 0
  });
  const wrapper = mount(<MyBaseRoute current={ 'guest' } memoryHistory={ history }/>);
  expect(wrapper.contains(BeforeLogin())).to.equals(true);
});

it('should render logged in route after login', () => {
  const history = createMemoryHistory({
    initialEntries: [ '/login' ],
    initialIndex: 0
  });
  const wrapper = mount(<MyBaseRoute current={ 'student' } memoryHistory={ history }/>);
  expect(wrapper.contains(AfterLogin())).to.equals(true);
});
