import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './module';
import { tempSetUser, check } from './module/user';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

function loadUser() {
    try {
        const user = localStorage.getItem('user');
        if (!user) return; //로그인 상태가 아닐 경우 아무것도 하지 않음
        store.dispatch(tempSetUser(JSON.parse(user)))
        store.dispatch(check())
    } catch (e) {
        console.log('localStorage is not working')
    }
}

sagaMiddleware.run(rootSaga);
loadUser();
//sagaMiddlewar.run이 호출된 후 loaduser 함수를 호출하는 것이 중요
//loaduser 함수를 먼저 호출하면 check액션을 디스패치 했을 때 사가에서 처리가 제대로 되지 않는다

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();