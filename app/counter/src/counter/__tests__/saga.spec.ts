import { testSaga } from 'redux-saga-test-plan';
import { fork, takeEvery } from 'redux-saga/effects';
import { changed, DECREMENT_ASYNC_NAME, INCREMENT_ASYNC_NAME, incrementAsync, received, requesting } from '../module';
import saga, { countDbGenerator, currentCountGenerator, decrementGenerator, fetchCount, incrementGenerator } from "../saga";

describe('counter/rootSaga', () => {

  it('root saga task', () => {

    const target = saga();
    let ret;

    ret = target.next();
    expect(ret.value).toEqual(fork(currentCountGenerator));
    ret = target.next();
    expect(ret.value).toEqual(takeEvery(INCREMENT_ASYNC_NAME, incrementGenerator));
    ret = target.next();
    expect(ret.value).toEqual(takeEvery(DECREMENT_ASYNC_NAME, decrementGenerator));
    ret = target.next();
    expect(ret.done).toBeTruthy();
  });
});

describe('counter/currentCountGenerator', () => {

  it('currentCountGenerator task', () => {

    testSaga(currentCountGenerator)
      .next()
      .call(fetchCount, 'http://localhost:4000/current_count')
      .next(1234)
      .put(changed(1234))
      .next()
      .isDone();
  });
});

describe('counter/countDbGenerator', () => {

  it('countDbGenerator task', () => {

    testSaga(countDbGenerator, 123, 'command')
      .next()
      .put(requesting())
      .next()
      .call(fetchCount, 'http://localhost:4000/command/123')
      .next(1234)
      .put(changed(1234))
      .next()
      .put(received())
      .next()
      .isDone();
  });
});

describe('counter/incrementGenerator', () => {

  it('incrementGenerator task', () => {

    const action = incrementAsync(123);

    testSaga(incrementGenerator, action)
      .next()
      .put(requesting())
      .next()
      .call(fetchCount, 'http://localhost:4000/increment/123')
      .next(1234)
      .put(changed(1234))
      .next()
      .put(received())
      .next()
      .isDone();
  });
});


describe('counter/decrementGenerator', () => {

  it('decrementGenerator task', () => {

    const action = incrementAsync(123);

    testSaga(decrementGenerator, action)
      .next()
      .put(requesting())
      .next()
      .call(fetchCount, 'http://localhost:4000/decrement/123')
      .next(1234)
      .put(changed(1234))
      .next()
      .put(received())
      .next()
      .isDone();
  });
});