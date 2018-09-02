import * as Axios from 'axios';
import { Action, createAction, handleActions } from 'redux-actions';
import * as effects from 'redux-saga/effects';

//
//  action
//
const INCREMENT_ASYNC_NAME: string  = 'counter/increment_async';
const DECREMENT_ASYNC_NAME: string  = 'counter/decrement_async';
const REQUESTING          : string  = 'counter/requesting';
const RECEIVED            : string  = 'counter/received';
const CHANGED             : string  = 'counter/changed';

export const incrementAsync = createAction<number, number>(INCREMENT_ASYNC_NAME , (num: number) => num);
export const decrementAsync = createAction<number, number>(DECREMENT_ASYNC_NAME , (num: number) => num);
export const requesting     = createAction(REQUESTING);
export const received       = createAction(RECEIVED);
export const changed        = createAction<number, number>(CHANGED              , (num: number) => num);

export type CounterDispatchType = (num: number) => void;

export interface ICounterState {
  num: number;
  loading: boolean;
}

//
//  reducer
//
export default handleActions<ICounterState, number>(
  {
    [CHANGED]: (state: ICounterState, action: Action<number>) => {
      return action.payload 
        ? {...state, num: action.payload}
        : state;
    },
    [REQUESTING]: (state: ICounterState, action: Action<any>) => {
      return {...state, loading: true};
    },
    [RECEIVED]: (state: ICounterState, action: Action<any>) => {
      return {...state, loading: false};
    },
  },
  {num: 0, loading: false});

//
//  Saga
//
function* countDbGenerator(action: Action<number>, command: string) {
  yield effects.put(requesting());
  try {
    if (action.payload !== undefined) {
      const result = yield effects.call(Axios.default.get, `http://localhost:4000/${command}/${action.payload}`);
      if (result.status === 200 && result.data.code === 0) {
        yield effects.put(changed(result.data.count))
      }
    }
  } finally {
    yield effects.put(received());
  }
}

export const saga = function*() {
  yield effects.takeEvery(INCREMENT_ASYNC_NAME, (action: Action<number>) => countDbGenerator(action, 'increment'));
  yield effects.takeEvery(DECREMENT_ASYNC_NAME, (action: Action<number>) => countDbGenerator(action, 'decrement'));
};
