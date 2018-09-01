import RaisedButton from 'material-ui/RaisedButton';
import * as React from 'react';

export interface IStateProps {
  loadingCount: number;
  num: number;
}

export interface IDispatchProps {
    onDecrement:      (num: number) => void;
    onDecrementAsync: (num: number) => void;
    onIncrement:      (num: number) => void;
    onIncrementAsync: (num: number) => void;
}

const Counter = (props: IStateProps & IDispatchProps) => {

  const onIncrement       = () => props.onIncrement(2)
  const onDecrement       = () => props.onDecrement(2)
  const onIncrementAsync  = () => props.onIncrementAsync(3)
  const onDecrementAsync  = () => props.onDecrementAsync(3)

  return (
        <div>
          <p>{props.loadingCount === 0 ? '' : 'Loading...'}</p>
          <p>{`score: ${props.num}`}</p>
          <RaisedButton label="Increment 3"       onClick={onIncrement}      />
          <RaisedButton label="Increment 2"       onClick={onDecrement}      />
          <RaisedButton label="Increment 3 Async" onClick={onIncrementAsync} />
          <RaisedButton label="Increment 3 Async" onClick={onDecrementAsync} />
        </div>
      );
};
export default Counter;
