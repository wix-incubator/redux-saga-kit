import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

const argumentRegexp = /\${args\[(\d+)]}/g;

export function stateSelector (path = '', defaultValue) {
    return (state, ...args) => {
        if (args.length) {
            path = path.replace(argumentRegexp, (match, p1) => {
                const i = +p1;

                if (isNumber(i)) {
                    return args[i];
                }
            });
        }

        return get(state, path, defaultValue);
    };
}