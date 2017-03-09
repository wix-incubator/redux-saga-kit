import { expect } from 'chai';
import * as SagaKit from '../src/index';

const { sagaCreator, stateSelector, recipes } = SagaKit;

describe('index.js', function () {
    it('should export sagaCreator', () => {
        expect(sagaCreator, 'typeof sagaCreator').to.be.a('function');
        expect(sagaCreator({}), 'typeof sagaCreator result').to.be.iterable;
    });
    it('should export stateSelector', () => {
        expect(stateSelector, 'typeof sagaCreator').to.be.a('function');
        expect(stateSelector('foo', {}), 'typeof sagaCreator result').to.be.a('function');
    });
    it('should export recipes', () => {
        expect(recipes, 'typeof recipes').to.be.a('object');
        expect(recipes.dispatchAndWait, 'typeof dispatchAndWait').to.be.iterable;
    });
});