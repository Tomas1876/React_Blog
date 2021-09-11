import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }`;

  //위에서 StyledButton을 바로 내보내도 되지만
  //자동 import가 되게 하기 위해 이렇게 작업해준다
const Button = props => <StyledButton {...props} />; //Button이 받아오는 모든 props를 StyledButton에 전달할 것
export default Button;