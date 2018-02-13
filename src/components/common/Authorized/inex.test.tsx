import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Authorized from './index';

const baseAuthority = [ 'student', 'TA', 'teacher' ];
const Failed = (
  <span>No! It Failed!</span>
);
const Passed = (
  <h1>Happy Passed!!!</h1>
);

it('renders without crashing', () => {
  shallow((
    <Authorized Exception={ Failed } current={ 'guest' } authority={ baseAuthority }>
      { Passed }
    </Authorized>
  ));
});

it('should fail when current rejected', () => {
  const wrapper = shallow((
    <Authorized Exception={ Failed } current={ 'guest' } authority={ baseAuthority }>
      { Passed }
    </Authorized>
  ));

  expect(wrapper.contains(Failed)).to.equals(true);
  expect(wrapper.contains(Passed)).to.equals(false);
});

it('should pass when current resolve', () => {
  const wrapper = shallow((
    <Authorized Exception={ Failed } current={ 'TA' } authority={ baseAuthority }>
      { Passed }
    </Authorized>
  ));

  expect(wrapper.contains(Failed)).to.equals(false);
  expect(wrapper.contains(Passed)).to.equals(true);
});
