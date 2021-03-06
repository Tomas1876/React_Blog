//인증 관련 리덕스 모듈
import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILRUE] = createRequestActionTypes('auth/REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILRUE] = createRequestActionTypes('auth/LOGIN');

//액션 생성 자동화
export const changeField = createAction(CHANGE_FIELD,
    ({ form, key, value }) => ({
        form, //register, login
        key, //username, password, passwordConfirm
        value //실제 바꾸려는 값
    })
);
export const initializeForm = createAction(INITIALIZE_FORM, form => form);
export const register = createAction(REGISTER, ({ username, password }) => ({ username, password }))
export const login = createAction(LOGIN, ({ username, password }) => ({ username, password }))

//사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
    //takeLatest는 요청을 두 번 할 경우 가장 최신의 요청만을 처리해준다
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
}

const initialState = {
    register: {
        username: '',
        password: '',
        passwordConfirm: ''
    },
    login: {
        username: '',
        password: ''
    },
    auth: null,
    authError: null
}

//리듀서
const auth = handleActions(

    //액션에 따라 실행할 함수를 가진 객체
    {
        [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
            produce(state, draft => {
                draft[form][key] = value; //예 : state.register.username을 바꾼다
            }),
        [INITIALIZE_FORM]: (state, { payload: form }) => ({
            ...state,
            [form]: initialState[form],
            authError: null //폼 전환시 회원인증 에러 초기화
        }),
        //회원가입 성공
        [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth
        }),
        //회원가입 실패
        [REGISTER_FAILRUE]: (state, { payload: error }) => ({
            ...state,
            authError: error
        }),
        //로그인 성공
        [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth
        }),
        //로그인 실패 
        [LOGIN_FAILRUE]: (state, { payload: error }) => ({
            ...state,
            authError: error
        })
    },
    initialState //상태 초기값
)

export default auth;