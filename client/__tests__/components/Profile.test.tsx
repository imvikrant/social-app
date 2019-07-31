import React from 'react';
import { shallow } from 'enzyme';
import Profile from '../../components/Profile';

let wrapper: any;

beforeEach(() => {
  wrapper = shallow(<Profile match={{params: {username: 'vikrant'}}}/>)
})

test('should render Profile correctly', () => {
  expect(wrapper).toMatchSnapshot();
})