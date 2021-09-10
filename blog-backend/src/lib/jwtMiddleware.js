import jwt from 'jsonwebtoken';
import User from '../models/user';
//토큰 미들웨어
const jwtMiddleware = async (ctx, next) =>{
    const token = ctx.cookies.get('access_token');
    if(!token) return next(); //토큰이 없음

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = {
            _id:decoded._id,
            username:decoded.username
        }

        //토큰의 남은 유효기간이 3.5일 미만일 경우 재발급
        const now = Math.floor(Date.now()/1000);
        //decoded.exp란 객체가 가진 exp로 만료기간을 알려주는 값
        //반대로 언제 만들었는지 알려주는 것은 iat
        if(decoded.exp - now < 60*60*24*3.5){
            const user = await User.findById(decoded._id);
            const token = user.generateToken();
            ctx.cookies.set('access_token',token,{
                maxAge:1000*60*60*24*7, 
                httpOnly:true
            });
        }
        console.log(decoded);
        return next();
    } catch(e){
        //토큰 검증 실패
        return next();
    }
}

export default jwtMiddleware;