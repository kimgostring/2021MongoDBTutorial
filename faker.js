const faker = require("faker");
const { User, Blog, Comment } = require("./src/models");

generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  if (typeof userCount !== "number" || userCount < 1)
    throw new Error("userCount must be a positive integer");
  if (typeof blogsPerUser !== "number" || blogsPerUser < 1)
    throw new Error("blogsPerUser must be a positive integer");
  if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
    throw new Error("commentsPerUser must be a positive integer");
  const users = [];
  const blogs = [];
  const comments = [];
  console.log("Preparing fake data.");

  // 테스트 데이터 생성
  for (let i = 0; i < userCount; i++) {
    users.push(
      new User({
        // 각 모델에 필요한 필드 값 faker에서 받아와 생성
        username: faker.internet.userName() + parseInt(Math.random() * 100), // 이름이 중복될 확률 줄임
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
        age: 10 + parseInt(Math.random() * 50), // 10~60 사이의 나이대 랜덤 생성
        email: faker.internet.email(),
      })
    );
  }

  // users 배열 안의 각 user에 대해
  users.map((user) => {
    // 각 유저별로 특정 개수만큼 블로그 생성
    for (let i = 0; i < blogsPerUser; i++) {
      blogs.push(
        new Blog({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          islive: true,
          user,
        })
      );
    }
  });

  users.map((user) => {
    // 각 유저별로 특정 개수만큼 댓글 생성
    for (let i = 0; i < commentsPerUser; i++) {
      // floor(내림), 0~99 사이의 랜덤 숫자
      let index = Math.floor(Math.random() * blogs.length); // blogs 배열 안의 한 블로그에 대한 댓글
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user,
          blog: blogs[index]._id,
        })
      );
    }
  });

  // 생성한 데이터들 DB에 저장 테스트
  console.log("fake data inserting to database...");
  await User.insertMany(users);
  console.log(`${users.length} fake users generated!`);
  await Blog.insertMany(blogs);
  console.log(`${blogs.length} fake blogs generated!`);
  await Comment.insertMany(comments);
  console.log(`${comments.length} fake comments generated!`);
  console.log("COMPLETE!!");
};

module.exports = { generateFakeData };
