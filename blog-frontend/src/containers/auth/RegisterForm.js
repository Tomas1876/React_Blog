import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm } from '../../module/auth';
import AuthForm from '../../components/auth/AuthForm';

const RegisterForm = () => {
    //생성한 action을 useDispatch를 통해 발생시킬 수 있다
    const dispatch = useDispatch();
    const { form } = useSelector(({ auth }) => ({
        form: auth.register
    }));

    //인풋 변경 핸들러
    const onChange = e => {
        const { value, name } = e.target;
        dispatch(changeField({ form: 'register', key: name, value }));
    }
    //폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();

    }

    //컴포넌트가 처음 렌더링 될 때 form을 초기화함
    useEffect(() => {
        dispatch(initializeForm('register'));
    }, [dispatch]);

    return (
        <AuthForm type='register'
            form={form}
            onChange={onChange}
            onSubmit={onSubmit} />
    );

}

export default RegisterForm;