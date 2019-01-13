"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/apollographql/graphql-subscriptions/issues/99#issuecomment-400500956
function withAsyncIteratorCancel(asyncIterator, onCancel) {
    return __assign({}, asyncIterator, { return: function () {
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