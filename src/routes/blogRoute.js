const { Router } = require("express");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");

const blogRouter = Router();

// 블로그 생성 API
blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required." });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required." });
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({ err: "islive is required. " });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "user id is invalid." });

    // 형식은 맞지만 DB에 존재하지 않는 유저일 수 있음
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send({ err: "user is not exist." });

    const blog = new Blog({ ...req.body, user });
    // 스키마에 없는 필드가 객체 프로퍼티로 있을 경우 무시됨
    // 백엔드에 저장된 Blog 객체에는 user 객체 그대로 들어가 있음
    // - 클라이언트에서 user 객체의 값 가져올 수 있음, 추가적인 작업 할 때 유용
    // mongoose에서 save할 때, user 객체를 보고 적절하게 변환하여 (_id를 빼와) 저장
    await blog.save();
    res.send(blog);
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// put, 전체 수정
blogRouter.put("/:blogId", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// patch, 부분적 수정
blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };
