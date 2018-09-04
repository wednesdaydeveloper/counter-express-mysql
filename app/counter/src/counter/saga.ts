import { Action } from 'redux-actions';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { changed, DECREMENT_ASYNC_NAME, INCREMENT_ASYNC_NAME, received, requesting } from './module';

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
const saga = function* () {
  yield fork(currentCountGenerator);
  yield takeEvery(INCREMENT_ASYNC_NAME, (action: Action<number>) => countDbGenerator(action.payload!, 'increment'));
  yield takeEvery(DECREMENT_ASYNC_NAME, (action: Action<number>) => countDbGenerator(action.payload!, 'decrement'));
};

export default saga;