// https://github.com/apollographql/graphql-subscriptions/issues/99#issuecomment-400500956
export function withAsyncIteratorCancel(asyncIterator, onCancel) {
  return {
    ...asyncIterator,
    return() {
      if (typeof onCancel === 'function') {
        onCancel();
      }
      return asyncIterator.return
        ? asyncIterator.return()
        : Promise.resolve({ value: undefined, done: true });
    },
  };
}