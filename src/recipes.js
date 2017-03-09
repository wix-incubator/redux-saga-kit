import { take, call, put, fork } from 'redux-saga/effects';

export function* dispatchAndListen ({action, listenTo, onTake}) {
    yield fork(waitForPattern, {
        patterns: listenTo,
        callback: onTake
    });
    yield put(action);
}

function* waitForPattern ({patterns, callback} = {patterns: [], callback: () => {}}) {
    const result = yield take(patterns);
    yield call(callback, result);
}