import { expect } from 'chai';
import { handle, takeLatest, cancelOn, throttle } from '../src/decorators';

const SOME_TYPE = 'someType';
const SOME_ACTION = 'someAction';
const SOME_OTHER_ACTION = 'someOtherAction';
const SOME_THROTTLE = 300;

describe.skip('decorators', function () {
    class MyClass {
        @handle(SOME_TYPE)
        handleTest() {}

        @takeLatest
        takeLatestTest() {}

        @cancelOn([SOME_ACTION, SOME_OTHER_ACTION])
        cancelOnTest() {}

        @throttle()
        defaultThrottleTest() {}

        @throttle(SOME_THROTTLE)
        someThrottleTest() {}
    }
    let myTest = null;

    before(function () {
        myTest = new MyClass();
    });

    describe('handle', function () {
        it('should have a type property', function () {
            expect(myTest.handleTest.type).to.equal(SOME_TYPE);
        });
    });

    describe('takeLatest', function () {
        it('should have a takeLatest property with true', function () {
            expect(myTest.takeLatestTest.takeLatest).to.be.true;
        });
    });

    describe('cancelOn', function () {
        it('should have a cancelOn property with a list of action types', function () {
            expect(myTest.cancelOnTest.cancelOn).to.deep.equal([SOME_ACTION, SOME_OTHER_ACTION]);
        });
    });

    describe('throttle', function () {
        it('should have a default throttle property', function () {
            expect(myTest.defaultThrottleTest.throttle).to.equal(100);
        });
        it('should have a custom throttle property', function () {
            expect(myTest.someThrottleTest.throttle).to.equal(SOME_THROTTLE);
        });
    });
});