const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config");
// 경로에 폴더명만 존재할 경우, 해당 폴더의 index.js 찾아 불러오게 됨
const { userRouter, blogRouter } = require("./routes");
// 테스트용 데이터 생성
const { generateFakeData } = require("../faker");
const port = 3000;

const server = async () => {
  try {
    // DB가 먼저 연결된 뒤 요청 받아야 함 (mongoose 연결 완료된 뒤 포트 수신 해야 함)
    await mongoose.connect(
      config.MONGO_URL,
      // 설정 객체 (옵션), mongoose 연결 시마다 뜨는 DeprecationWarning 제거해줌
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("MongoDB connected");
    // mongoose.set("debug", true); // mongoose debug mode

    // 유저 100명, 블로그 1000개, 후기 30000개
    // await generateFakeData(100, 10, 300);

    app.use(express.json());

    // 라우터
    app.use("/users", userRouter);
    app.use("/blogs", blogRouter);

    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

server();
