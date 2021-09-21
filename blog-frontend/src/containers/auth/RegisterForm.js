import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../module/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../module/user';

//history를 사용하기 위해 필요한 객체
import { withRouter } from 'react-router-dom';

const RegisterForm = ({ history }) => {
    const [error, setError] = useState(null);

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
        //하나라도 비어 있다면
        if ([username, password, passwordConfirm].includes('')) {
            setError('빈 칸을 모두 채워주세요');
            return
        }
        //비밀번호가 일치하지 않는다면
        if (password != passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다');
            dispatch(changeField({ form: 'register', key: 'password', vlaue: '' }));
            dispatch(changeField({ form: 'register', key: 'passwordConform', vlaue: '' }));
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
            //계정명이 이미 존재할 때
            if (authError.response.status === 409) {
                setError('사용할 수 없는 아이디입니다');
                return
            }
            //그 외
            setError('회원가입에 실패했습니다');
            return
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
            onSubmit={onSubmit}
            error={error} />
    );

}

export default withRouter(RegisterForm);