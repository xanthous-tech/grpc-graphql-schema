"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/apollographql/graphql-subscriptions/issues/99#issuecomment-400500956
function withAsyncIteratorCancel(asyncIterator, onCancel) {
    return Object.assign({}, asyncIterator, { return() {
            if (typeof onCancel === 'function') {
                onCancel();
            }
            return asyncIterator.return
                ? asyncIterator.return()
                : Promise.resolve({ value: undefined, done: true });
        } });
}
exports.withAsyncIteratorCancel = withAsyncIteratorCancel;
//# sourceMappingURL=subscription.js.map