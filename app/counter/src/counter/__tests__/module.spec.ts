import reducer, {changed, ICounterState, received, requesting } from "../module";

describe('counter/module', () => {
  it('counter/changed in loading', () => {
    const state: ICounterState = {num: 4, loading: true};
    const result = reducer(state,  changed(5));
    expect(result.num).toBe(5);
    expect(result.loading).toBe(state.loading);
  });

  it('counter/changed in not loading', () => {
    const state: ICounterState = {num: 4, loading: false};
    const result = reducer(state,  changed(5));
    expect(result.num).toBe(5);
    expect(result.loading).toBe(state.loading);
  });

  it('counter/requesting in loading', () => {
    const state: ICounterState = {num: 4, loading: true};
    const result = reducer(state, requesting());
    expect(result.num).toBe(state.num );
    expect(result.loading).toBe(true);
  });

  it('counter/requesting in not loading', () => {
    const state: ICounterState = {num: 4, loading: false};
    const result = reducer(state, requesting());
    expect(result.num).toBe(state.num );
    expect(result.loading).toBe(true);
  });
  it('counter/received in loading', () => {
    const state: ICounterState = {num: 4, loading: true};
    const result = reducer(state, received());
    expect(result.num).toBe(state.num );
    expect(result.loading).toBe(false);
  });

  it('counter/received in not loading', () => {
    const state: ICounterState = {num: 4, loading: false};
    const result = reducer(state, received());
    expect(result.num).toBe(state.num );
    expect(result.loading).toBe(false);
  });

})