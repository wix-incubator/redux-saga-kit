import _ from 'lodash';

export function stateSelector (path = '', defaultValue) {
    return state => _.get(state, path, defaultValue);
}