//로그인 했을 때만 API 사용할 수 있게 하는 미들웨어
//각 함수에서 처리할 수도 있지만 하나의 미들웨어로 관리하는 것이 더 좋다
const checkLoggedIn = (ctx,next)=>{
    if(!ctx.state.user){
        ctx.status = 401;
        return;
    }
    return next();
}

//이제 posts 라우터에서 사용할 것이다
export default checkLoggedIn;