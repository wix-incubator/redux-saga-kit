import { expect } from 'chai';
import SagaTester from 'redux-saga-tester';
import { sagaCreator } from '../src/creator';
import * as recipes from '../src/recipes';
import sinon from 'sinon';

const ACTIONS = {
    ACTION: 'ACTION',
    DISPATCH_ACTION: 'DISPATCH_ACTION',
    LISTEN_TO_ACTION: 'LISTEN_TO_ACTION',
    LISTEN_TO_ACTION_2: 'LISTEN_TO_ACTION_2'
};

function action () {
    return {
        type: ACTIONS.ACTION
    };
}

function dispatchAction () {
    return {
        type: ACTIONS.DISPATCH_ACTION
    };
}

function listenToAction (payload) {
    return {
        type: ACTIONS.LISTEN_TO_ACTION,
        payload
    };
}

function listenToAction2 (payload) {
    return {
        type: ACTIONS.LISTEN_TO_ACTION_2,
        payload
    };
}

function createSagaTester () {
    return new SagaTester({
        initialState: {},
        reducers : {myReducer: ((state = {}) => state)},
        middlewares : []
    });
}

const somePayload = 'somePayload';
const someOtherPayload = 'someOtherPayload';

describe('recipes', function () {
    let sagaTester = null;
    let mySpy = sinon.spy();

    beforeEach(() => {
        mySpy.reset();
        sagaTester = createSagaTester();
    });

    describe('dispatchAndListen', function () {
        let saga = null;

        const handler = () => function* () {
            yield recipes.dispatchAndListen({
                action: dispatchAction(),
                listenTo: [ACTIONS.LISTEN_TO_ACTION],
                onTake: function (result) {
                    mySpy(result);
                }
            });
        };
        const handlerWithTwo = () => function* () {
            yield recipes.dispatchAndListen({
                action: dispatchAction(),
                listenTo: [ACTIONS.LISTEN_TO_ACTION, ACTIONS.LISTEN_TO_ACTION_2],
                onTake: function (result) {
                    mySpy(result);
                }
            });
        };

        it('should listen to ONE action, dispatch and handle', function () {
            saga = sagaCreator({
                [ACTIONS.ACTION]: handler
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            sagaTester.dispatch(listenToAction(somePayload));
            expect(sagaTester.wasCalled(ACTIONS.DISPATCH_ACTION), 'wasCalled(ACTIONS.DISPATCH_ACTION)').to.be.true;
            expect(mySpy.calledOnce, 'mySpy.calledOnce').to.be.true;
            const call = mySpy.getCall(0);
            expect(call.args[0], 'call.args').to.deep.equal({type: ACTIONS.LISTEN_TO_ACTION, payload: somePayload});
        });

        it('should listen to TWO actions, dispatch first and handle', function () {
            saga = sagaCreator({
                [ACTIONS.ACTION]: handlerWithTwo
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            sagaTester.dispatch(listenToAction(somePayload));
            expect(sagaTester.wasCalled(ACTIONS.DISPATCH_ACTION), 'wasCalled(ACTIONS.DISPATCH_ACTION)').to.be.true;
            expect(mySpy.calledOnce, 'mySpy.calledOnce').to.be.true;
            const call = mySpy.getCall(0);
            expect(call.args[0], 'call.args').to.deep.equal({type: ACTIONS.LISTEN_TO_ACTION, payload: somePayload});
        });

        it('should listen to TWO actions, dispatch second and handle', function () {
            saga = sagaCreator({
                [ACTIONS.ACTION]: handlerWithTwo
            });
            sagaTester.start(function* () {
                yield saga();
            });

            sagaTester.dispatch(action());
            sagaTester.dispatch(listenToAction2(someOtherPayload));
            expect(sagaTester.wasCalled(ACTIONS.DISPATCH_ACTION), 'wasCalled(ACTIONS.DISPATCH_ACTION)').to.be.true;
            expect(mySpy.calledOnce, 'mySpy.calledOnce').to.be.true;
            const call = mySpy.getCall(0);
            expect(call.args[0], 'call.args').to.deep.equal({type: ACTIONS.LISTEN_TO_ACTION_2, payload: someOtherPayload});
        });
    });
});

