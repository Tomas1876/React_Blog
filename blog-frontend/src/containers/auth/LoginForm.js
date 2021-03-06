import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeField, initializeForm, login } from '../../module/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../module/user'

const LoginForm = ({ history }) => {

    const [error, setError] = useState(null)

    //생성한 action을 useDispatch를 통해 발생시킬 수 있다
    const dispatch = useDispatch();
    const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
    }));

    //인풋 변경 핸들러
    const onChange = e => {
        const { value, name } = e.target;
        dispatch(changeField({ form: 'login', key: name, value }));
    }
    //폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();
        const { username, password } = form;
        dispatch(login({ username, password }))

    }

    //컴포넌트가 처음 렌더링 될 때 form을 초기화함
    useEffect(() => {
        dispatch(initializeForm('login'));
    }, [dispatch]);

    useEffect(() => {
        if (authError) {
            console.log(authError);
            setError('로그인 실패')
            return
        }
        if (auth) {
            console.log('로그인 성공');
            dispatch(check());
        }
    }, [auth, authError, dispatch]);
    useEffect(() => {
        if (user) {
            history.push('/');
            // localStorage를 이용해 로그인 유지
            try {
                localStorage.setItem('user', JSON.stringify(user))
            } catch (error) {
                console.log('localStorage is not working')
            }
        }
    }, [history, user]);

    return (
        <AuthForm type='login'
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error} />
    );

}

export default withRouter(LoginForm);