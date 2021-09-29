import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';

//새로 고침 이후 임시 로그인 처리
const TEMP_SET_USER = 'user/TEMP_SET_USER';

//회원정보 확인
const [CHECK, CHCEK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes('user/check');

export const tempSetUser = createAction(TEMP_SET_USER, user => user);
export const check = createAction(CHECK);

const checkSaga = createRequestSaga(CHECK, authAPI.check)
function checkFailureSaga() {
    try {
        localStorage.removeItem('user') // localStorage에서 user 제거
    } catch (error) {
        console.log(error)
    }
}

export function* userSaga() {
    yield takeLatest(CHECK, checkSaga);
    yield takeLatest(CHECK_FAILURE, checkFailureSaga)
}

const initialState = {
    user: null,
    checkError: null
}

export default handleActions(
    {
        [TEMP_SET_USER]: (state, { payload: user }) => ({
            ...state,
            user
        }),
        [CHCEK_SUCCESS]: (state, { payload: user }) => ({
            ...state,
            user,
            checkError: null
        }),
        [CHECK_FAILURE]: (state, { payload: error }) => ({
            ...state,
            user: null,
            checkError: error
        })
    }, initialState
)