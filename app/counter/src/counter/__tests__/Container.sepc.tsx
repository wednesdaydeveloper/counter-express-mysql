import { configure, shallow, ShallowWrapper } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import configureMockStore, { MockStoreCreator } from 'redux-mock-store';
import CountContainer, { mapDispatchToProps, mapStateToProps } from '../Container';
import { DECREMENT_ASYNC_NAME, ICounterState, INCREMENT_ASYNC_NAME } from '../module';

// import reduxMockStore = require('redux-mock-store');

configure({ adapter: new Adapter() });

describe('mapStateToProps', () => {
  it('should show previously mapStateToProps value', () => {
      const initialState: ICounterState = {
        loading: false,
        num: 123,
      };

      expect(mapStateToProps(initialState).loading).toEqual(initialState.loading);
      expect(mapStateToProps(initialState).num).toEqual(initialState.num);
  });
});

describe('mapDispatchToProps', () => {
  it('onIncrementAsync', () => {
    const dispatch = jest.fn();

    mapDispatchToProps(dispatch).onIncrementAsync(345);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: INCREMENT_ASYNC_NAME, payload: 345 });
  });

  it('onDecrementAsync', () => {
    const dispatch = jest.fn();

    mapDispatchToProps(dispatch).onDecrementAsync(678);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: DECREMENT_ASYNC_NAME, payload: 678 });
  });
});


describe('connected component', () => {
  let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  const shallowWithStore = (component: any, store: any) => {
    const context = {
      store
    }
    return shallow(component, { context })
  }
  const mockStore = configureMockStore();

  let store: any;

  beforeEach(() => {
      const initialState: ICounterState = {
        loading: false,
        num: 123,
      };
      store = mockStore(initialState);

      wrapper = shallowWithStore(<CountContainer />, store);
  });

  it('properties', () => {
    expect(wrapper.props().loading).toBe(false);
    expect(wrapper.props().num).toBe(123);
  });

  it('dispatch INCREMENT_ASYNC_NAME', () => {
    wrapper.props().onIncrementAsync(123);

    const actions = store.getActions();
    expect(actions).toEqual([ { type: INCREMENT_ASYNC_NAME, payload: 123 } ]);
  });

  it('dispatch DECREMENT_ASYNC_NAME', () => {
    wrapper.props().onDecrementAsync(456);

    const actions = store.getActions();
    expect(actions).toEqual([ { type: DECREMENT_ASYNC_NAME, payload: 456 } ]);
  });

});