import { expect } from 'chai';
import { sagaCreator, stateSelector } from '../src/index';

describe('index.js', function () {
    it('should export sagaCreator', () => {
        expect(sagaCreator, 'typeof sagaCreator').to.be.a('function');
        expect(sagaCreator({}), 'typeof sagaCreator result').to.be.iterable;
    });
    it('should export stateSelector', () => {
        expect(stateSelector, 'typeof sagaCreator').to.be.a('function');
        expect(stateSelector('foo', {}), 'typeof sagaCreator result').to.be.a('function');
    });
});