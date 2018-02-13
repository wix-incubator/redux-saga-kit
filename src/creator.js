import { all, call, fork, take, cancel, throttle, takeEvery, takeLatest } from 'redux-saga/effects';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';

function* runSingleTask (pattern, saga, ...args) {
    return yield fork(function* () {
        const action = yield take(pattern);
        yield call(saga, action, ...args);
    });
}

function* runTask (takerFunc, pattern, saga, ...args) {
    return yield fork(function* () {
        yield takerFunc(pattern, saga, ...args);
    });
}

function* listenToCancel(cancelPatterns, takeFirst, task, taker, pattern, saga, ...args) {
// eslint-disable-next-line no-constant-condition
    while (true) {
        yield take(cancelPatterns);
        yield cancel(task);

        if (takeFirst) {
            break;
        }

        task = yield fork(runTask, taker, pattern, saga, ...args);
    }
}

function* takeWithCancel(isLatest = false, takeFirst = false, pattern, cancelPatterns = [], saga, ...args) {
    let taker = null;
    let task = null;

    if (takeFirst) {
        task = yield fork(runSingleTask, pattern, saga, ...args);
    } else {
        taker = isLatest ? takeLatest : takeEvery;
        task = yield fork(runTask, taker, pattern, saga, ...args);
    }

    if (isString(cancelPatterns)) {
        cancelPatterns = [cancelPatterns];
    }

    if (isArray(cancelPatterns) && cancelPatterns.length > 0) {
        yield fork(listenToCancel, cancelPatterns, takeFirst, task, taker, pattern, saga, ...args);
    }
}

const generateWatcher = (sagaParams, actionType, defs) => function* () {
    if (isFunction(defs)) {
        yield takeEvery(actionType, defs(sagaParams));
    } else if (isFunction(defs.handler)) {
        const handler = defs.noParams ? defs.handler : defs.handler(sagaParams);
        if (defs.throttle) {
            let throttleMs = isNumber(defs.throttle) ? defs.throttle : 100;
            yield throttle(throttleMs, actionType, handler);
        } else {
            let cancelOn = defs.cancelOn || [];
            yield* takeWithCancel(!!defs.takeLatest, !!defs.takeFirst, actionType, cancelOn, handler);
        }
    }
};

/*eslint-disable no-unused-vars*/
function generateConfFromSaga (saga) {
    const config = {};

    for (let handler in saga) {
        if (handler.handle) {
            const type = handler.handle;

            config[type] = {
                handler,
                takeLatest: handler.takeLatest,
                throttle: handler.throttle,
                cancelOn: handler.cancelOn
            };
        }
    }

    return config;
}
/*eslint-enable no-unused-vars*/

// ============================================================================
// DEFAULT SAGA EXPORT
// ============================================================================

export function sagaCreator(sagaConfig) {
    let config = sagaConfig;

    return function* (sagaParams) {
        let forks = [];

        forEach(config, (defs, actionType) => {
            forks.push(fork(generateWatcher(sagaParams, actionType, defs)));
        });

        yield all(forks);
    };
}

/*eslint-disable no-unused-vars*/
export class Saga {}
/*eslint-enable no-unused-vars*/
