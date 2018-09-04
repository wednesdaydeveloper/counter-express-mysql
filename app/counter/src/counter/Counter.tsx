import RaisedButton from 'material-ui/RaisedButton';
import * as React from 'react';

export interface IStateProps {
  loading: boolean;
  num: number;
}

export interface IDispatchProps {
    onDecrementAsync: (num: number) => void;
    onIncrementAsync: (num: number) => void;
}

const Counter = (props: IStateProps & IDispatchProps) => {

  const onIncrementAsync  = () => props.onIncrementAsync(3)
  const onDecrementAsync  = () => props.onDecrementAsync(3)

  return (
        <div>
          <p>{props.loading ? 'Loading...' :  ''}</p>
          <p>{`count: ${props.num}`}</p>
          <RaisedButton label="Increment 3 Async" disabled={props.loading} onClick={onIncrementAsync} />
          <RaisedButton label="Increment 3 Async" disabled={props.loading} onClick={onDecrementAsync} />
        </div>
      );
};
export default Counter;
