import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

//StyledLink와 StyledButton 에서 같은 스타일을 사용하기 때문에
//재사용 할 수 있도록 한다
const buttonStyle = css`
  border:none;
  border-radius:4px;
  font-size:1rem;
  font-weight:bold;
  padding:0.25rem 1rem;
  color:white;
  outline:none;
  cursor:pointer;
  background: ${palette.gray[8]};
  $:hover{
    background:${palette.gray[6]};
  }

  ${props => props.fullWidth && css`
      padding-top:0.75rem;
      padding-bottom:0.75rem;
      width:100%;
      font-size:1.125rem;
  `}

  ${props => props.cyan && css`
      background : ${palette.cyan[5]};
      &:hover{
        background:${palette.cyan[4]};
      }
  `}
`;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
      ${buttonStyle}
`;


//위에서 StyledButton을 바로 내보내도 되지만
//자동 import가 되게 하기 위해 이렇게 작업해준다
//Button이 받아오는 모든 props를 StyledButton에 전달할 것
const Button = props => {
  {/*styled함수로 감싸서 만든 컴포넌트는 임의의 props가 필터링 되지 않기 때문에
                cyan=true 등의 값이 a태그에 그대로 전달된다
               그런데 a태그는 boolen 값이 임의의 props로 설정되는 것을 허용하지 않고
              숫자나 문자열만 허용하기 때문에 삼항연산자로 boolen 값을 숫자로 만들어준 것*/}
  return props.to ? (<StyledLink {...props} cyan={props.cyan ? 1 : 0} />)
    : (<StyledButton {...props} />);
}
export default Button;