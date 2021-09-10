import Post from '../../models/post';
import mongoose from 'mongoose'; //db 연결
import Joi from 'joi'; //Request Body 검증을 위한 

const { ObjectId } = mongoose.Types;

//ObjectId 검증
// export const checkOgetbjectId = (ctx, next) => {
//   const { id } = ctx.params;
//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400; // Bad Request
//     return;
//   }
//   return next();
// };
export const getPostById = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try{
    const post = await Post.findById(id);

    //포스트가 존재하지 않을 때
    if(!post){
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  }catch(e){
    ctx.throw(500,e)
  }
  return next();
};


/*
  POST /api/posts
  {
    title: '제목',
    body: '내용',
    tags: ['태그1', '태그2']
  }
*/
export const write = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required() 가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(), // 문자열로 이루어진 배열
  });

  // 검증 후, 검증 실패시 에러처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user:ctx.state.user
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/posts
*/
export const list = async ctx => {
  // query 는 문자열이기 때문에 숫자로 변환해주어야한다.
  // 값이 주어지지 않았다면 1 을 기본으로 사용.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      //sort 함수의 파라미터는 {key:1} 형식으로 넣는데
      //1이면 오름차훈, -1이면 내림차순이다 최신순으로 보여주기 위해 내림차순 설정
      .sort({ _id: -1 })
      .limit(10) //보이는 개수 제한(pagination)
      .skip((page - 1) * 10)
      //원래 find()를 통해 조회한 데이터는 mogoose의 문서 인스턴스 형태라 바로 변환이 불가하다
      //toJSON() 함수로 json 형태로 만들어주거나 아래 lean() 함수를 사용해야 한다
      //lean 함수를 사용하면 바로 json 형태로 조회할 수 있다
      .lean() 
      .exec();

    //커스텀 헤더를 사용해 마지막 페이지 알려주기
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    //본문 내용 200자 이상이면 자르기
    ctx.body = posts.map(post => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

//사용자의 포스트가 아니면 403 리턴
export const checkOwnPost=(ctx, next)=>{
  const {user, post} = ctx.state;

  //MongoDB에서 조회한 데이터의 id값을 문자열과 비교할 때는 반드시 toString()을 해주어야 한다
  if(post.user._id.toString() !== user._id){ 
    ctx.status = 403;
    return;
  }
  return next();
}

/*
  GET /api/posts/:id
*/
export const read = async ctx => {
  ctx.body = ctx.state.post;
};

/*
  DELETE /api/posts/:id
*/
export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공은 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/posts/:id
  {
    title: '수정',
    body: '수정 내용',
    tags: ['수정', '태그']
  }
*/
export const update = async ctx => {
  const { id } = ctx.params;
  // write 에서 사용한 schema 와 비슷한데, required() 가 없다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증 후, 검증 실패시 에러처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환.
      // false 일 때에는 업데이트 되기 전의 데이터를 반환.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
