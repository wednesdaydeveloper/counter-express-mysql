import { Action, createAction, handleActions } from 'redux-actions';
import { delay } from 'redux-saga';
import * as effects from 'redux-saga/effects';

//
//  action
//
const INCREMENT_NAME      : string  = 'counter/increment';
const DECREMENT_NAME      : string  = 'counter/decrement';
const INCREMENT_ASYNC_NAME: string  = 'counter/increment_async';
const DECREMENT_ASYNC_NAME: string  = 'counter/decrement_async';

export const increment      = createAction<number, number>(INCREMENT_NAME, (num: number) => num);
export const decrement      = createAction<number, number>(DECREMENT_NAME, (num: number) => num);
export const incrementAsync = createAction<number, number>(INCREMENT_ASYNC_NAME, (num: number) => num);
export const decrementAsync = createAction<number, number>(DECREMENT_ASYNC_NAME, (num: number) => num);

export type CounterDispatchType = (num: number) => void;

export interface ICounterState {
  loadingCount: number;
  num: number;
}

//
//  reducer
//
export default handleActions<ICounterState, number>(
  {
    [INCREMENT_NAME]: (state: ICounterState, action: Action<number>) => {
      return action.payload 
        ? {...state, num: state.num + action.payload}
        : state;
    },
    [DECREMENT_NAME]: (state: ICounterState, action: Action<number>) => {
      return action.payload 
        ? {...state, num: state.num - action.payload}
        : state;
    },
  },
  {num: 0, loadingCount: 0});

//
//  Saga
//

function* incrementAsyncGenerator(action: Action<number>) {
  yield delay(1000);
  yield effects.put(increment(action.payload ? action.payload : 0));
}

function* decrementAsyncGenerator(action: Action<number>) {
  yield delay(1000);
  yield effects.put(decrement(action.payload ? action.payload : 0));
}

export const saga = function*() {
  yield effects.takeEvery(INCREMENT_ASYNC_NAME, incrementAsyncGenerator);
  yield effects.takeEvery(DECREMENT_ASYNC_NAME, decrementAsyncGenerator);
};
