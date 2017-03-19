export function handle(type) {
    return function (target, key, descriptor) {
        descriptor.value.type = type;
        return descriptor;
    }
}

export function takeLatest(target, key, descriptor) {
    descriptor.value.takeLatest = true;
}

export function cancelOn(actions = []) {
    return function (target, key, descriptor) {
        descriptor.value.cancelOn = actions;
    }
}

export function throttle(throttle = 100) {
    return function (target, key, descriptor) {
        descriptor.value.throttle = throttle;
    };
}
