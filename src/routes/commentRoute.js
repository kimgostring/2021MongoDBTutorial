const { Router } = require("express");
const { Comment } = require("../models/Comment");

// blogRoute.js에서 설정한 엔드포인트 /:blogId의 값 불러올 수 있게 해주는 설정
const commentRouter = Router({ mergeParams: true });

/*  
    comment의 경로?
    - 위의 두 개와 달리 독립적으로 호출될 일 X, 하위 개념
    - 특정 블로그의 댓글 등을 불러오게 될 것
*/

// 등록 API
commentRouter.post("/:commentId", async (req, res) => {
  res.send(req.params);
});

// 조회 API
commentRouter.get("/");

module.exports = { commentRouter };
