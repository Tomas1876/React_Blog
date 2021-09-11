//인증 관련 리덕스 모듈
import {createAction, handleActions} from 'redux-actions';

const  SAMPLE_ACTION = 'auth/SAMPLE_ACTION';
export const sampleAction = createAction(SAMPLE_ACTION); //액션 생성 자동화

const initialState = {}

//리듀서
const auth = handleActions(
    {
        [SAMPLE_ACTION]:(state, action)=> state, //액션에 따라 실행할 함수를 가진 객체
    },
    initialState //상태 초기값
)

export default auth;