const { Router } = require("express");
const { Comment, Blog, User } = require("../models");
const { isValidObjectId, startSession } = require("mongoose");

const commentsLimit = 3;

// blogRoute.js에서 설정한 엔드포인트 /:blogId의 값 불러올 수 있게 해주는 설정
const commentRouter = Router({ mergeParams: true });

// comment의 경로?
// - 위의 두 개와 달리 독립적으로 호출될 일 X, 하위 개념
// - 특정 블로그의 댓글 등을 불러오게 될 것

// 댓글 등록 API
commentRouter.post("/", async (req, res) => {
  const session = await startSession();
  let comment;

  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blog id is invalid." });

    const { content, userId } = req.body;
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "user id is invalid." });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required." });

    await session.withTransaction(async () => {
      // 트랜색션
      const [blog, user] = await Promise.all([
        Blog.findById(blogId, {}, { session }), // 세 번째 옵션에 넣어주어야 함
        User.findById(userId, {}, { session }),
      ]);

      if (!blog || !user)
        return res.status(400).send({ err: "blog or user does not exist." });
      if (!blog.islive)
        return res.status(400).send({ err: "blog is not available." });

      comment = new Comment({
        content,
        user,
        userFullName: `${user.name.first}${
          user.name.last ? ` ${user.name.last}` : ""
        }`,
        blog: blogId,
      });

      blog.commentsCount++;
      blog.comments.unshift(comment);
      if (blog.commentsCount > commentsLimit) blog.comments.pop();

      await Promise.all([
        comment.save({ session }),
        blog.save(), // session을 이용해서 불러온 문서에는 이미 session 내장되어 있음
      ]);
    });

    // await로 트랜색션 기다린 뒤 client로 결과 보내기
    res.send({ success: true, comment });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ err: err.message });
  } finally {
    await session.endSession();
  }
});

// 댓글 조회 API
commentRouter.get("/", async (req, res) => {
  try {
    let { page = 0 } = req.query; // 디스트럭처링, 기본값 0
    page = parseInt(page);

    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blog id is invalid." });

    // 블로그 id 존재 여부 필요하지 않은 이유, 해당하는 댓글 없으므로 어차피 빈 배열 리턴됨
    // 생성/수정이 아닌 경우에는 확인을 최소화하는 것이 좋음
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .skip(page * commentsLimit)
      .limit(commentsLimit);
    res.send({ success: true, comments });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// 후기의 content만 수정하는 API
commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (typeof content !== "string")
    return res.status(400).send({ err: "content is required." });

  // 디스트럭처링, 이 경우 Promise.all 배열의 첫 번째 요소만 변수 comment에 받아오게 됨
  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    // 블로그에 내장된 후기 수정
    Blog.updateOne(
      { "comments._id": commentId },
      { "comments.$.content": content }
    ),
  ]);

  return res.send({ success: true, comment });
});

// 삭제 API
commentRouter.delete("/:commentId", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const [comment, extraComment, blog] = await Promise.all([
      Comment.findOneAndDelete({ _id: commentId }),
      Comment.findOne({ blog: blogId })
        .sort({ createdAt: -1 })
        .skip(commentsLimit), // 내장된 comment 중 하나가 삭제되었을 때를 대비해,
      // 바로 다음 순서의 comment 불러오기
      Blog.findOne({ _id: blogId }),
    ]);
    if (!comment) return res.status(400).send({ err: "comment is not exist." });

    blog.commentsCount--;
    blog.comments = blog.comments.filter((blogComment) => {
      return blogComment._id.toString() !== comment._id.toString();
    });
    if (
      blog.comments.length < commentsLimit &&
      blog.commentsCount >= commentsLimit
    ) {
      // blog에 내장된 후기가 삭제되었고, 보여줄 수 있는 후기 더 있는 경우
      blog.comments.push(extraComment);
    }

    await Blog.updateOne({ _id: blogId }, blog);
    res.send({ success: true, comment, blog });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { commentRouter };
