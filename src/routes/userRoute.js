// 유저 관련 API
const { Router } = require("express");
const { User, Blog, Comment } = require("../models");
const mongoose = require("mongoose"); // isValidObjectedId

const userRouter = Router();

// 모든 유저를 배열로 불러오는 API
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ success: true, users });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// 특정 유저를 불러오는 API
userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid user id." });

    const user = await User.findOne({ _id: userId });
    res.status(200).send({ success: true, user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// 특정 유저를 삭제하는 API
userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid user id." });

    // deleteOne() : 검색된 유저 불러오지 않고 바로 삭제, 유저 정보 필요 없는 경우 더 효율적
    // findOneAndDelete() : 삭제한 문서 리턴, 일치하는 것이 없는 경우 null 리턴
    const [user] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMany(
        { "comments.user": userId },
        { $pull: { comments: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);

    res.status(200).send({ success: true, user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// 특정 유저 정보 업데이트하는 API
userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid user id." });

    // 유저 정보의 age, name만 수정 가능하도록
    const { age, name } = req.body;

    if (!age && !name)
      return res.status(400).send({ err: "age or name is required." });
    if (name && !name.first)
      return res.status(400).send({ err: "first name is required." });

    if (
      name &&
      (typeof name.first !== "string" ||
        (name.last && typeof name.last !== "string"))
    )
      return res
        .status(400)
        .send({ err: "first name and last name are string." });
    if (age && typeof age !== "number")
      return res.status(400).send({ err: "age must be a number." });

    // const updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;
    // const user = await User.findOneAndUpdate({ _id: userId }, updateBody, { new: true });

    // 주석과 동일한 코드
    const user = await User.findOne({ _id: userId });
    if (age) user.age = age;

    // blog와 comment에 내장된 name도 바꿔주어야 함
    if (name) {
      user.name = name;
      await Promise.all([
        // 한 유저가 여러 블로그 작성 가능, 같은 유저의 여러 블로그 수정해야 함
        Blog.updateMany({ "user._id": userId }, { "user.name": name }),
        // 배열 필드에서 조건 맞는 여러 원소 찾아 수정할 때, arrayfilters 이용
        Blog.updateMany(
          { "comments.user": userId },
          { "comments.$[element].userFullName": `${name.first} ${name.last}` },
          { arrayFilters: [{ "element.user": userId }] }
        ),
        Comment.updateMany(
          { user: userId },
          { userFullName: `${name.first} ${name.last}` }
        ),
      ]);
    }
    await user.save();

    res.status(200).send({ success: true, user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// 유저 추가하는 API
userRouter.post("/", async (req, res) => {
  try {
    // 구조 분해 할당
    let { username, name } = req.body;
    // 아래와 동일한 구문
    // let username = req.body.username
    // let name = req.body.name
    // required: true인 username, name.first가 제대로 들어왔는지 확인
    if (!username)
      return res.status(400).send({ err: "username is required. " });
    if (!name || !name.first)
      return res.status(400).send({ err: "first name is required." });

    const user = new User(req.body); // 유저 문서 인스턴스를 mongoose로 생성
    await user.save(); // mongoose에서 제공하는 함수를 통해 해당 문서를 DB에 저장
    res.status(200).send({ success: true, user });
  } catch (err) {
    return res.status(500).send({ err: err.message }); // server error
    // err.message, 오류 발생 스택 부분은 빼고 오류 메세지만 보낼 수 있음
  }
});

module.exports = { userRouter };
