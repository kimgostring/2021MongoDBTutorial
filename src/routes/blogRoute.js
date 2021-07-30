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
    // islive는 무조건 존재하지 않아도 됨 (default 옵션 존재하므로)
    // islive가 있을 때 boolean이 아니면 문제 발생
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({ err: "islive must be a boolean." });
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
    res.send({ success: true, blog });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// 전체 블로그 불러오는 API
blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.send({ success: true, blogs });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// 하나의 블로그 불러오는 API
blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blog id is invalid." });

    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) return res.status(400).send({ err: "blog is not exist." });
    res.send({ success: true, blog });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// put, 전체 수정
blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blog id is invalid." });

    const { title, content } = req.body;

    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required." });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required." });

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );

    res.send({ success: true, blog });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// patch, 부분적 수정 (islive)
blogRouter.patch("/:blogId/islive", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blog id is invalid." });

    const { islive } = req.body;
    // islive를 수정하는 API이므로, 필수인 값
    if (typeof islive !== "boolean")
      return res.status(400).send({ err: "boolean islive is required." });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { islive },
      { new: true }
    );
    res.send({ success: true, blog });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };
