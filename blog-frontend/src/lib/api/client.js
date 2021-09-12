import axios from 'axios';

const client = axios.create;

// 인스턴스를 생성하지 않아도 작업할 수 있지만
// 인스턴ㄴ스를 만들지 않으면 어플리케이션에서 발생하는 모든 요청에 대해 설정하게 되므로
// 또 다른 API 서버를 사용하려 할 때 곤란해질 수 있다.
// 또한 인스턴스를 만들면 나중에 API 클라이언트에 공통된 설정을 쉽게 넣을 수 있다.

export default client;