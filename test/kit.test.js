import { expect } from 'chai';
import { stateSelector } from '../src/kit';

describe('stateSelector', function () {
    const state = {
        someProperty: 'someValue',
        someObjectProperty: {
            property: 'someValue2'
        },
        someArrayProperty: [{arrayProperty: 'arrayValue'}]
    };

    it('should select a property from the state', () => {
        const selector = stateSelector('someProperty');
        expect(selector(state)).to.equal(state.someProperty);
    });

    it('should return default value for undefined property', () => {
        const someDefaultValue = 'someDefaultValue';
        const selector = stateSelector('someUndefinedProperty', someDefaultValue);
        expect(selector(state)).to.equal(someDefaultValue);
    });

    it('should select a nested property from the state', () => {
        const selector = stateSelector('someObjectProperty.property');
        expect(selector(state)).to.equal(state.someObjectProperty.property);
    });

    it('should select a nested array item from the state', () => {
        const selector = stateSelector('someArrayProperty[0].arrayProperty');
        expect(selector(state)).to.equal(state.someArrayProperty[0].arrayProperty);
    });

    it('should interpolate parameters with default value', () => {
        const args = [0];
        const selector = stateSelector('someArrayProperty[${args[0]}].arrayProperty', 0);
        expect(selector(state, ...args)).to.equal(state.someArrayProperty[0].arrayProperty);
    });

    it('should interpolate parameters without default value', () => {
        const args = [0];
        const selector = stateSelector('someArrayProperty[${args[0]}].arrayProperty');
        expect(selector(state, ...args)).to.equal(state.someArrayProperty[0].arrayProperty);
    });
});