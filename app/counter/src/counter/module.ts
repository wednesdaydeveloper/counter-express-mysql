import { Action, createAction, handleActions } from 'redux-actions';

//
// action
//
export const INCREMENT_ASYNC_NAME: string = 'counter/increment_async';
export const DECREMENT_ASYNC_NAME: string = 'counter/decrement_async';
const REQUESTING:           string = 'counter/requesting';
const RECEIVED:             string = 'counter/received';
const CHANGED:              string = 'counter/changed';

//
//  action creator
//
export const incrementAsync = createAction<number, number>(INCREMENT_ASYNC_NAME, (num: number) => num);
export const decrementAsync = createAction<number, number>(DECREMENT_ASYNC_NAME, (num: number) => num);
export const changed        = createAction<number, number>(CHANGED, (num: number) => num);
export const requesting     = createAction(REQUESTING);
export const received       = createAction(RECEIVED);

/**
 * State のインターフェイス
 */
export interface ICounterState {
  num: number;
  loading: boolean;
}

/**
 * state の初期値
 */
const initState: ICounterState = { num: 0, loading: false };

/**
 * reducer
 */
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
