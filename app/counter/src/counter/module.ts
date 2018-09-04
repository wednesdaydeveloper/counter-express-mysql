import { Action, createAction, handleActions } from 'redux-actions';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

//
// action
//
const INCREMENT_ASYNC_NAME: string = 'counter/increment_async';
const DECREMENT_ASYNC_NAME: string = 'counter/decrement_async';
const REQUESTING:           string = 'counter/requesting';
const RECEIVED:             string = 'counter/received';
const CHANGED:              string = 'counter/changed';

export const incrementAsync = createAction<number, number>(INCREMENT_ASYNC_NAME, (num: number) => num);
export const decrementAsync = createAction<number, number>(DECREMENT_ASYNC_NAME, (num: number) => num);
export const changed        = createAction<number, number>(CHANGED, (num: number) => num);
export const requesting     = createAction(REQUESTING);
export const received       = createAction(RECEIVED);

export type CounterDispatchType = (num: number) => void;

export interface ICounterState {
  num: number;
  loading: boolean;
}

//
// reducer
//

/**
 * state の初期値
 */
const initState: ICounterState = { num: 0, loading: false };

export default handleActions<ICounterState, number>({
  [CHANGED]: (state: ICounterState, action: Action<number>) => {
    return { ...state, num: action.payload! };
  },
  [REQUESTING]: (state: ICounterState, action: Action<any>) => {
    return { ...state, loading: true };
  },
  [RECEIVED]: (state: ICounterState, action: Action<any>) => {
    return { ...state, loading: false };
  },
}, initState);

/**
 * nodeapi から現在の count を取得する。
 * @param url URL
 */
function fetchCount(url: string): Promise<number> {
  return fetch(url)
    .then(result => result.json())
    .then(result => result.count)
    .catch(err => 0);
}

//
// Saga
//

/**
 * nodeapi から増加／減少後の count を取得するゼネレーター。
 * @param num 変化量
 * @param command 増加／減少
 */
function* countDbGenerator(num: number, command: string) {
  yield put(requesting());
  try {
    const url = `http://localhost:4000/${command}/${num}`;
    const count = yield call(fetchCount, url);
    yield put(changed(count))
  } catch (ex) {
    console.log(ex);
  } finally {
    yield put(received());
  }
}

/**
 * countの初期化
 */
function* currentCountGenerator() {
  try {
    const count = yield call(fetchCount, `http://localhost:4000/current_count`);
    yield put(changed(count));
  } catch (ex) {
    console.log(ex);
  }
}
/**
 * saga
 */
export const saga = function* () {
  yield fork(currentCountGenerator);
  yield takeEvery(INCREMENT_ASYNC_NAME, (action: Action<number>) => countDbGenerator(action.payload!, 'increment'));
  yield takeEvery(DECREMENT_ASYNC_NAME, (action: Action<number>) => countDbGenerator(action.payload!, 'decrement'));
};
