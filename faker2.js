const faker = require("faker");
const { User } = require("./src/models");
const axios = require("axios");
const URI = "http://localhost:3000";

generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  try {
    if (typeof userCount !== "number" || userCount < 1)
      throw new Error("userCount must be a positive integer");
    if (typeof blogsPerUser !== "number" || blogsPerUser < 1)
      throw new Error("blogsPerUser must be a positive integer");
    if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
      throw new Error("commentsPerUser must be a positive integer");
    let users = [];
    let blogs = [];
    let comments = [];

    for (let i = 0; i < userCount; i++) {
      users.push(
        new User({
          username: faker.internet.userName() + parseInt(Math.random() * 100),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          age: 10 + parseInt(Math.random() * 50),
          email: faker.internet.email(),
        })
      );
    }

    console.log("fake data inserting to database...");

    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);

    users.map((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          // new Blog 대신, API 호출을 통해 블로그 생성
          axios.post(`${URI}/blogs`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            islive: true,
            userId: user.id,
          })
        );
      }
    });

    let newBlogs = await Promise.all(blogs);
    console.log(`${newBlogs.length} fake blogs generated!`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          // new Comment 대신, API 호출을 통해 블로그 생성
          axios.post(
            // 여기서 얻어온 값은 res.data.blogs에 존재
            // 한 user는 commentsPerUser만큼 댓글 작성, 블로그는 랜덤으로 결정
            `${URI}/blogs/${newBlogs[index].data.blogs._id}/comments`,
            {
              content: faker.lorem.sentence(),
              userId: user.id,
            }
          )
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);
    console.log("COMPLETE!!");
  } catch (err) {
    // 오류 메세지 쉽게 확인하기 위함
    console.log(err);
  }
};

module.exports = { generateFakeData };
