console.log("client code running.");
const axios = require("axios");

const test = async () => {
  // 여기 안에서 비동기적으로 백엔드 호출
  let {
    data: { blogs },
  } = await axios.get("http://localhost:3000/blogs");

  // 각 blog마다 비동기적으로 user와 comments 추가해서 리턴해주길 바람
  // Promise.all은 Promise들을 배열로 받음, 배열.map(콜백)이 배열 리턴하게 됨
  // 배열.map(콜백)은 주로 배열 가공 시 사용되는 함수
  // for/while과 달리, 각 콜백 실행에서 리턴된 값들을 원소로 갖는 배열을 결과로 리턴함
  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const res = await Promise.all([
        axios.get(`http://localhost:3000/users/${blog.user}`),
        axios.get(`http://localhost:3000/blogs/${blog._id}/comments`),
      ]);

      blog.user = res[0].data.user;
      blog.comments = res[1].data.comments;
      return blog;
    })
  );

  console.log(blogs[0]);
};

test();
