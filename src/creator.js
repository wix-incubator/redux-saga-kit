import { takeEvery, takeLatest } from 'redux-saga';
import { fork, take, cancel, throttle } from 'redux-saga/effects';
import _ from 'lodash';

function* runTask (takerFunc, pattern, saga, ...args) {
    return yield fork(function* () {
        yield takerFunc(pattern, saga, ...args);
    });
}

function* listenToCancel(cancelPatterns, task, taker, pattern, saga, ...args) {
    while (true) {
        yield take(cancelPatterns);
        yield cancel(task);
        task = yield fork(runTask, taker, pattern, saga, ...args);
    }
}

function *takeWithCancel(isLatest = false, pattern, cancelPatterns = [], saga, ...args) {
    let taker = isLatest ? takeLatest : takeEvery;
    let task = yield fork(runTask, taker, pattern, saga, ...args);

    if (_.isString(cancelPatterns)) {
        cancelPatterns = [cancelPatterns];
    }

    if (_.isArray(cancelPatterns) && cancelPatterns.length > 0) {
        yield fork(listenToCancel, cancelPatterns, task, taker, pattern, saga, ...args);
    }
}

const generateWatcher = (sagaParams, actionType, callback) => function* () {
    if (_.isFunction(callback)) {
        yield* takeEvery(actionType, callback(sagaParams));
    } else if (_.isFunction(callback.fn)) {
        if (callback.throttle) {
            let throttleMs = _.isNumber(callback.throttle) ? callback.throttle : 100;
            yield* throttle(throttleMs, actionType, callback.fn(sagaParams));
        } else {
            let cancelOn = callback.cancelOn || [];
            yield* takeWithCancel(!!callback.takeLatest, actionType, cancelOn, callback.fn(sagaParams));
        }
    }
};

// ============================================================================
// DEFAULT SAGA EXPORT
// ============================================================================

export default function (actionConfig) {
    return function* sagaCreator(sagaParams) {
        let forks = [];

        _.forEach(actionConfig, (callback, actionType) => {
            forks.push(fork(generateWatcher(sagaParams, actionType, callback)));
        });

        yield forks;
    };
}

// export function* forkAnDispatch ({patterns, callback} = {patterns: [], callback: () => {}}) {
//     return new Promise()
//     const result = yield take(patterns);
//     yield call(callback, result);
// }