import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import Counter, { IDispatchProps, IStateProps } from './Counter';
import * as Module from './module';

function mapStateToProps(state: Module.ICounterState): IStateProps {
  return {
    loading: state.loading,
    num: state.num,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): IDispatchProps {
  return {
    onDecrementAsync: (num: number) => dispatch(Module.decrementAsync(num)),
    onIncrementAsync: (num: number) => dispatch(Module.incrementAsync(num)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Counter);
