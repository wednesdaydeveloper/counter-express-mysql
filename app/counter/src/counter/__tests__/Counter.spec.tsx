import { configure, shallow } from "enzyme";
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from "react";
import Counter, { IDispatchProps, IStateProps } from "../Counter";

configure({ adapter: new Adapter() });

/* === 新規追加ここまで === */
describe('Counter', () => {

  it('rendering', () => {
    const props: IStateProps & IDispatchProps = {
      loading: false,
      num: 123,
      onDecrementAsync: (num: number) => undefined,
      onIncrementAsync: (num: number) => undefined,
    };
    const wrapper = shallow(<Counter {...props} />)
    expect(wrapper.find('p').at(0).prop('children')).toBe('');
    expect(wrapper.find('p').at(1).prop('children')).toBe('count: 123');
    expect(wrapper.find('RaisedButton').at(0).prop('disabled')).toBe(false);
    expect(wrapper.find('RaisedButton').at(1).prop('disabled')).toBe(false);
  });

  it('rendering in loadding...', () => {
    const props: IStateProps & IDispatchProps = {
      loading: true,
      num: 234,
      onDecrementAsync: (num: number) => undefined,
      onIncrementAsync: (num: number) => undefined,
    };
    const wrapper = shallow(<Counter {...props} />)
    expect(wrapper.find('p').at(0).prop('children')).toBe('Loading...');
    expect(wrapper.find('p').at(1).prop('children')).toBe('count: 234');
    expect(wrapper.find('RaisedButton').at(0).prop('disabled')).toBe(true);
    expect(wrapper.find('RaisedButton').at(1).prop('disabled')).toBe(true);
  });

  it('click', () => {
    const props: IStateProps & IDispatchProps = {
      loading: false,
      num: 123,
      onDecrementAsync: (num: number) => undefined,
      onIncrementAsync: (num: number) => undefined,
    };

    spyOn(props, 'onIncrementAsync');
    spyOn(props, 'onDecrementAsync');

    const wrapper = shallow(<Counter {...props} />);
    wrapper.find('RaisedButton').at(0).simulate('click');
    wrapper.find('RaisedButton').at(1).simulate('click');

    expect(props.onIncrementAsync).toHaveBeenCalledWith(3);
    expect(props.onDecrementAsync).toHaveBeenCalledWith(3);
  });

});