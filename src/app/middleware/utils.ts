export const middlewareFabric = <S, A extends IAction>(actionType: any) => (cb: IMiddleCB<S, A>) => (store: S) => (next: INext<A>) => (action: A) => {
  if (action.type === actionType) {
    return cb(store, next, action);
  } else {
    next(action);
  }
};

interface IAction {
  type: string|any,
  payload?: any;
}

type INext<A> = (action: A) => void;
type IMiddleCB<S, A> = (store: S, next: INext<A>, action: A) => void;
