import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../module/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../module/user';
import { withRouter } from 'react-router-dom';

const RegisterForm = ({ history }) => {
    //생성한 action을 useDispatch를 통해 발생시킬 수 있다
    const dispatch = useDispatch();
    const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
        form: auth.register,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
    }));

    //인풋 변경 핸들러
    const onChange = e => {
        const { value, name } = e.target;
        dispatch(changeField({ form: 'register', key: name, value }));
    }
    //폼 등록 이벤트 핸들러
    //이 이벤트 발생시 reigster 함수에 username과 password를 파라미터로 넣어 디스패치 해준다
    const onSubmit = e => {
        e.preventDefault();
        const { username, password, passwordConfirm } = form;
        if (password != passwordConfirm) {
            // 오류처리 해야 함
            return;
        }
        dispatch(register({ username, password }));
    }

    //컴포넌트가 처음 렌더링 될 때 form을 초기화함
    useEffect(() => {
        dispatch(initializeForm('register'));
    }, [dispatch]);

    //회원가입 성공/실패 처리
    //사가에서 API 요청을 처리하고, 이에 대한 결과는 auth/authError를 통해 조회할 수 있다
    //auth, authError 중 어떤 값이 유효한지에 따라 다른 작업 수행
    useEffect(() => {
        if (authError) {
            console.log('오류발생')
            console.log(authError)
        }
        if (auth) {
            console.log('회원가입 성공')
            console.log(auth);
            dispatch(check())
        }
    }, [auth, authError, dispatch]);
    //user 값이 잘 설정되었는지 확인
    useEffect(() => {
        if (user) {
            console.log('check API 성공');
            history.push('/'); //회원가입 후 홈 화면으로 이동
        }
    }, [user])

    return (
        <AuthForm type='register'
            form={form}
            onChange={onChange}
            onSubmit={onSubmit} />
    );

}

export default withRouter(RegisterForm);