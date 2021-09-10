import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write); //이제 checkLoggedIn이 실행되고 그 다음에 다음라우터가 실행된다

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/',checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);
/*
//아이디 검증이 필요하므로 chekObjectId 미들웨어 추가
post.get('/:id',postsCtrl.checkObjectId, postsCtrl.read)
post.delete('/:id',postsCtrl.checkObjectId, postsCtrl.remove)
post.patch('/:id',postsCtrl.checkObjectId, postsCtrl.upadte)
*/
//위 세 줄을 리팩토링 해 아래 한 줄로 만들 수 있다
posts.use('/:id', postsCtrl.getPostById, post.routes()); 

export default posts;
