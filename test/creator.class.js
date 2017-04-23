// /* eslint no-unused-vars: 0 */  // --> OFF
// import { expect } from 'chai';
// import { delay } from 'redux-saga';
// import { sagaCreator, Saga } from '../src/creator';
// import { delay as testDelay } from './helpers/testHelpers';
// import SagaTester from 'redux-saga-tester';
// import sinon from 'sinon';
// import { handle, takeLatest, cancelOn, throttle } from '../src/decorators';
//
// const ACTION_DELAY = 200;
//
// const ACTIONS = {
//     ACTION: 'ACTION',
//     SECOND_ACTION: 'SECOND_ACTION',
//     DELAYED_ACTION: 'DELAYED_ACTION',
//     LATEST_ACTION: 'LATEST_ACTION',
//     CANCEL_ACTION: 'CANCEL_ACTION',
//     THROTTLE_ACTION: 'THROTTLE_ACTION'
// };
//
// function action () {
//     return {
//         type: ACTIONS.ACTION
//     };
// }
//
// function secondAction () {
//     return {
//         type: ACTIONS.SECOND_ACTION
//     };
// }
//
// function delayedAction () {
//     return {
//         type: ACTIONS.DELAYED_ACTION
//     };
// }
//
// function createSagaTester () {
//     return new SagaTester({
//         initialState: {},
//         reducers : {myReducer: ((state = {}) => state)},
//         middlewares : []
//     });
// }
//
// xdescribe('sagaCreator class', function () {
//     let sagaTester = null;
//     let mySpy = sinon.spy();
//     let saga = null;
//
//     const handler = () => function* () {
//         yield mySpy();
//     };
//
//     const delayedHandler = () => function* () {
//         yield delay(ACTION_DELAY);
//         mySpy();
//     };
//
//     class mySaga extends Saga {
//         @handle(ACTIONS.ACTION)
//         * handler() {
//             yield mySpy();
//         }
//
//         @handle(ACTIONS.DELAYED_ACTION)
//         * delayedHandler() {
//             yield delay(ACTION_DELAY);
//             yield mySpy();
//         }
//
//         @takeLatest
//         @handle(ACTIONS.LATEST_ACTION)
//         * takeLatestHandler() {
//             yield mySpy();
//         }
//
//         @cancelOn([ACTIONS.ACTION])
//         @handle(ACTIONS.CANCEL_ACTION)
//         * cancelOnHandler() {
//             yield mySpy();
//         }
//
//         @throttle()
//         @handle(ACTIONS.THROTTLE_ACTION)
//         * throttleHandler() {
//             yield mySpy();
//         }
//
//         @throttle(500)
//         @handle(ACTIONS.THROTTLE_ACTION)
//         * customThrottleHandler() {
//             yield mySpy();
//         }
//     }
//
//     beforeEach(() => {
//         mySpy.reset();
//         sagaTester = createSagaTester();
//         saga = sagaCreator(new mySaga());
//     });
//
//     it('should take every with no definitions', async () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         sagaTester.dispatch(action());
//         expect(mySpy.calledOnce, 'handler called once').to.be.true;
//         await testDelay(200);
//         sagaTester.dispatch(action());
//         expect(mySpy.calledTwice, 'handler called twice').to.be.true;
//     });
//
//     it('should take every with handler callback syntax', async () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         sagaTester.dispatch(action());
//         expect(mySpy.calledOnce, 'handler called once').to.be.true;
//         await testDelay(200);
//         sagaTester.dispatch(action());
//         expect(mySpy.calledTwice, 'handler called twice').to.be.true;
//     });
//
//     it('should take last with takeLatest', async () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         sagaTester.dispatch(delayedAction());
//         await testDelay(ACTION_DELAY / 2);
//         sagaTester.dispatch(delayedAction());
//         await testDelay(ACTION_DELAY + 50);
//         expect(mySpy.callCount, 'mySpy.callCount').to.equal(1);
//     });
//
//     it('should cancel with cancelOn - one action', async () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         sagaTester.dispatch(delayedAction());
//         await testDelay(ACTION_DELAY / 2);
//         sagaTester.dispatch(secondAction());
//         await testDelay(ACTION_DELAY + 50);
//         expect(mySpy.callCount, 'mySpy.callCount').to.equal(0);
//     });
//
//     it('should cancel with cancelOn - multiple', async () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         sagaTester.dispatch(delayedAction());
//         await testDelay(ACTION_DELAY / 2);
//         sagaTester.dispatch(action());
//         await testDelay(ACTION_DELAY + 50);
//         expect(mySpy.callCount, 'mySpy.callCount').to.equal(0);
//
//         sagaTester.dispatch(delayedAction());
//         await testDelay(ACTION_DELAY / 2);
//         sagaTester.dispatch(secondAction());
//         await testDelay(ACTION_DELAY + 50);
//         expect(mySpy.callCount, 'mySpy.callCount').to.equal(0);
//     });
//
//     it('should throttle events - default throttle (100ms)', async () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         let timer = Date.now();
//         for (let i = 0; i < 100; i++) {
//             sagaTester.dispatch(action());
//             await delay(10);
//         }
//         timer = Date.now() - timer;
//
//         expect(mySpy.callCount, 'mySpy.callCount').to.be.most(Math.ceil(timer / 100));
//         await delay(100);
//     });
//
//     it('should throttle events - with 100 ms', async () => {
//         const THROTTLE_TIME = 100;
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         let timer = Date.now();
//         for (let i = 0; i < 100; i++) {
//             sagaTester.dispatch(action());
//             await delay(10);
//         }
//         timer = Date.now() - timer;
//
//         expect(mySpy.callCount, 'mySpy.callCount').to.be.most(Math.ceil(timer / THROTTLE_TIME));
//         await delay(100);
//     });
//
//     it('should throttle events - with 500 ms', async () => {
//         const THROTTLE_TIME = 500;
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         let timer = Date.now();
//         for (let i = 0; i < 100; i++) {
//             sagaTester.dispatch(action());
//             await delay(10);
//         }
//         timer = Date.now() - timer;
//
//         expect(mySpy.callCount, 'mySpy.callCount').to.be.most(Math.ceil(timer / THROTTLE_TIME));
//         await delay(100);
//     });
//
//     it('should take handler without saga params', () => {
//         sagaTester.start(function* () {
//             yield saga();
//         });
//
//         sagaTester.dispatch(action());
//         expect(mySpy.calledOnce, 'handler called once').to.be.true;
//         sagaTester.dispatch(action());
//         expect(mySpy.calledTwice, 'handler called twice').to.be.true;
//     });
// });
