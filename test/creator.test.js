import { expect } from 'chai';
import { delay } from 'redux-saga';
import { sagaCreator } from '../src/creator';
import { delay as testDelay } from './helpers/testHelpers';
import SagaTester from 'redux-saga-tester';
import sinon from 'sinon';

const ACTION_DELAY = 200;
const LONG_ACTION_DELAY = 2000;

const ACTIONS = {
    ACTION: 'ACTION',
    SECOND_ACTION: 'SECOND_ACTION',
    DELAYED_ACTION: 'DELAYED_ACTION'
};

function action () {
    return {
        type: ACTIONS.ACTION
    };
}

function secondAction () {
    return {
        type: ACTIONS.SECOND_ACTION
    };
}

function delayedAction () {
    return {
        type: ACTIONS.DELAYED_ACTION
    };
}

function createSagaTester () {
    return new SagaTester({
        initialState: {},
        reducers : {myReducer: ((state = {}) => state)},
        middlewares : []
    });
}

describe('sagaCreator', function () {
    let sagaTester = null;
    let mySpy = sinon.spy();

    const handler = () => function* () {
        yield mySpy();
    };

    const delayedHandler = () => function* () {
        yield delay(ACTION_DELAY);
        mySpy();
    };

    const longDelayedHandler = () => function* () {
        yield delay(LONG_ACTION_DELAY);
        mySpy();
    };

    function* handlerNoParams () {
        yield mySpy();
    }

    beforeEach(() => {
        mySpy.reset();
        sagaTester = createSagaTester();
    });

    describe('default props', function () {
        it('should take every with no definitions', async () => {
            const saga = sagaCreator({
                [ACTIONS.ACTION]: handler
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            expect(mySpy.calledOnce, 'handler called once').to.be.true;
            await testDelay(200);
            sagaTester.dispatch(action());
            expect(mySpy.calledTwice, 'handler called twice').to.be.true;
        });
    });

    describe('handler prop', function () {
        it('should take every with handler callback syntax', async () => {
            const saga = sagaCreator({
                [ACTIONS.ACTION]: {handler: handler}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            expect(mySpy.calledOnce, 'handler called once').to.be.true;
            await testDelay(200);
            sagaTester.dispatch(action());
            expect(mySpy.calledTwice, 'handler called twice').to.be.true;
        });
    });

    describe('takeLatest prop', function () {
        it('should take last with takeLatest', async () => {
            const saga = sagaCreator({
                [ACTIONS.DELAYED_ACTION]: {handler: delayedHandler, takeLatest: true}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(delayedAction());
            await testDelay(ACTION_DELAY / 2);
            sagaTester.dispatch(delayedAction());
            await testDelay(ACTION_DELAY + 50);
            expect(mySpy.callCount, 'mySpy.callCount').to.equal(1);
        });
    });

    describe('cancelOn prop', function () {
        it('should cancel with cancelOn - one action', async () => {
            const saga = sagaCreator({
                [ACTIONS.DELAYED_ACTION]: {handler: delayedHandler, cancelOn: ACTIONS.SECOND_ACTION}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(delayedAction());
            await testDelay(ACTION_DELAY / 2);
            sagaTester.dispatch(secondAction());
            await testDelay(ACTION_DELAY + 50);
            expect(mySpy.callCount, 'mySpy.callCount').to.equal(0);
        });

        it('should cancel with cancelOn - multiple', async () => {
            const saga = sagaCreator({
                [ACTIONS.DELAYED_ACTION]: {handler: delayedHandler, cancelOn: [ACTIONS.ACTION, ACTIONS.SECOND_ACTION]}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(delayedAction());
            await testDelay(ACTION_DELAY / 2);
            sagaTester.dispatch(action());
            await testDelay(ACTION_DELAY + 50);
            expect(mySpy.callCount, 'mySpy.callCount').to.equal(0);

            sagaTester.dispatch(delayedAction());
            await testDelay(ACTION_DELAY / 2);
            sagaTester.dispatch(secondAction());
            await testDelay(ACTION_DELAY + 50);
            expect(mySpy.callCount, 'mySpy.callCount').to.equal(0);
        });
    });

    describe('throttle', function () {
        it('should throttle events - default throttle (100ms)', async () => {
            const saga = sagaCreator({
                [ACTIONS.ACTION]: {handler: handler, throttle: true}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            let timer = Date.now();
            for (let i = 0; i < 100; i++) {
                sagaTester.dispatch(action());
                await delay(10);
            }
            timer = Date.now() - timer;

            expect(mySpy.callCount, 'mySpy.callCount').to.be.most(Math.ceil(timer / 100));
            await delay(100);
        });

        it('should throttle events - with 100 ms', async () => {
            const THROTTLE_TIME = 100;
            const saga = sagaCreator({
                [ACTIONS.ACTION]: {handler: handler, throttle: THROTTLE_TIME}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            let timer = Date.now();
            for (let i = 0; i < 100; i++) {
                sagaTester.dispatch(action());
                await delay(10);
            }
            timer = Date.now() - timer;

            expect(mySpy.callCount, 'mySpy.callCount').to.be.most(Math.ceil(timer / THROTTLE_TIME));
            await delay(100);
        });

        it('should throttle events - with 500 ms', async () => {
            const THROTTLE_TIME = 500;
            const saga = sagaCreator({
                [ACTIONS.ACTION]: {handler: handler, throttle: THROTTLE_TIME}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            let timer = Date.now();
            for (let i = 0; i < 100; i++) {
                sagaTester.dispatch(action());
                await delay(10);
            }
            timer = Date.now() - timer;

            expect(mySpy.callCount, 'mySpy.callCount').to.be.most(Math.ceil(timer / THROTTLE_TIME));
            await delay(100);
        });
    });

    describe('noParams prop', function () {
        it('should take handler without saga params', () => {
            const saga = sagaCreator({
                [ACTIONS.ACTION]: {handler: handlerNoParams, noParams: true}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            expect(mySpy.calledOnce, 'handler called once').to.be.true;
            sagaTester.dispatch(action());
            expect(mySpy.calledTwice, 'handler called twice').to.be.true;
        });
    });

    describe('takeFirst prop', function () {
        it('should take only the first action called', () => {
            const saga = sagaCreator({
                [ACTIONS.ACTION]: {handler: handler, takeFirst: true}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            expect(mySpy.calledOnce, 'handler called once').to.be.true;
            sagaTester.dispatch(action());
            expect(mySpy.calledTwice, 'handler called twice').to.be.false;
        });

        it('should be abled to be cancelled', () => {
            const saga = sagaCreator({
                [ACTIONS.DELAYED_ACTION]: {handler: longDelayedHandler, takeFirst: true, cancelOn: ACTIONS.SECOND_ACTION}
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(delayedAction());
            sagaTester.dispatch(secondAction());
            expect(mySpy.callCount, 'handler callCount').to.equal(0);
            sagaTester.dispatch(action());
            expect(mySpy.callCount, 'handler callCount').to.equal(0);
        });
    });
});