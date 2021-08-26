const express = require("express");
const app = express();
const mongoose = require("mongoose");
// 경로에 폴더명만 존재할 경우, 해당 폴더의 index.js 찾아 불러오게 됨
const { userRouter, blogRouter } = require("./routes");
// 테스트용 데이터 생성
// const { generateFakeData } = require("../faker2");

const server = async () => {
  try {
    const { MONGO_URL, PORT } = process.env;
    if (!MONGO_URL) throw new Error("MONGO_URL is required. ");
    if (!PORT) throw new Error("PORT is required. ");

    // DB가 먼저 연결된 뒤 요청 받아야 함 (mongoose 연결 완료된 뒤 포트 수신 해야 함)
    await mongoose.connect(
      MONGO_URL,
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

    app.use(express.json());

    // 라우터
    app.use("/users", userRouter);
    app.use("/blogs", blogRouter);

    app.listen(PORT, async () => {
      console.log(`server listening on port ${PORT}`);
      // server의 API 사용하므로, 서버가 다 켜진 뒤 함수 실행해야 함

      // 유저 100명, 블로그 1000개, 후기 30000개 - 엄청 많은 호출을 병렬로 한 번에 하게 되면 오류 생김
      // for문을 통해 20번을 순차적으로 하면 과부화되지 않을 것
      // Error: connect ECONNREFUSED 127.0.0.1:3000
      // at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)
      // console.time("insert time");
      // await generateFakeData(10, 2, 10);
      // console.timeEnd("insert time");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
