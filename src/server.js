const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config");
const { userRouter } = require("./routes/userRoute");
const { blogRouter } = require("./routes/blogRoute");
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
