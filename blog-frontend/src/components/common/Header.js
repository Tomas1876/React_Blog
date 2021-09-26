import styled from "styled-components";
import Responsive from "./Responsive";
import Button from "./Button";
import { Link } from "react-router-dom";

/* 헤더 */
const HeaderBlock = styled.div`
    position:fixed;
    width:100%;
    background:white;
    box-shadow:0px 2px 4px rgba(0,0,0,0.08)
`;


//Responsive 컴포넌트 속성에 스타일을 추가해서 새로운 컴포넌트 생성
const Wrapper = styled(Responsive)`
    heightL4rem;
    display:flex;
    align-items:center;
    justify-content:space-between;
    .logo{
        font-size:1.125rem;
        font-weight:800;
        letter-spacing:2px;
    }
    .right{
        display:flex;
        align-items:center
    }
`;

const UserInfo = styled.div`
    font-weight:800;
    margin-right:1rem;
`;

//헤더가 차지하는 공간만큼 위쪽 여백 주기
const Spacer = styled.div`
    height:4rem;
`;

const Header = ({ user }) => {
    return (
        <>
            <HeaderBlock>
                <Wrapper>
                    <Link to='/' className='logo'>REACTERS</Link>
                    {user ? (<div className='right'>
                        <UserInfo>{user.username}님</UserInfo>
                        <Button>로그아웃</Button>
                    </div>) :
                        (<div className='right'>
                            <Button to='/login'>로그인</Button>
                        </div>)}
                </Wrapper>
            </HeaderBlock>
            <Spacer />
        </>
    )
}

export default Header;