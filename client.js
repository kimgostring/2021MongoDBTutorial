console.log("client code running.");
const axios = require("axios");
const URI = "http://localhost:3000";

const test = async () => {
  // 여기 안에서 비동기적으로 백엔드 호출
  let {
    // 가져온 문서의 data 필드의 blogs 필드를 blogs라는 변수명으로 디스트럭처링
    data: { blogs },
  } = await axios.get(`${URI}/blogs`);

  // 각 blog마다 비동기적으로 user와 comments 추가해서 리턴해주길 바람
  // Promise.all은 Promise들을 배열로 받음, 배열.map(콜백)이 배열 리턴하게 됨
  // 배열.map(콜백)은 주로 배열 가공 시 사용되는 함수
  // for/while과 달리, 각 콜백 실행에서 리턴된 값들을 원소로 갖는 배열을 결과로 리턴함
  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const [res1, res2] = await Promise.all([
        axios.get(`${URI}/users/${blog.user}`),
        axios.get(`${URI}/blogs/${blog._id}/comments`),
      ]);

      blog.user = res1.data.user;
      blog.comments = await Promise.all(
        // 댓글에 댓글 작성한 유저 정보 추가
        res2.data.comments.map(async (comment) => {
          // map을 통해 해당 배열을 프로미스 리턴하는 배열로 변환
          // 각 댓글에 대해 작성자 정보를 비동기로 가져옴
          const {
            // get으로 가져온 문서의 data 필드의 user 필드를 같은 이름으로 디스트럭처링
            data: { user },
          } = await axios.get(`${URI}/users/${comment.user}`);
          comment.user = user;
          return comment;
        })
      );
      return blog;
    })
  );

  // console.log, console.dir
  // 디폴트 옵션으로는, 중첩된 객체의 경우 값이 보여지지 않고 [Object]로 출력됨
  // console.dir 함수에 두 번째 값으로 depth 조건을 주면, 해당 깊이만큼 객체 확인 가능
  console.dir(blogs[0], { depth: 10 });
};

test();
