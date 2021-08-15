const {
  Schema,
  model,
  // 저번에 Blog.js에서 사용한 type: Types.ObjectId만을 따로 가져올 수 있음
  Types: { ObjectId },
} = require("mongoose");

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: "user", index: true },
    userFullName: { type: String, required: true },
    blog: { type: ObjectId, required: true, ref: "blog" },
  },
  { timestamps: true }
);

// 먼저 같은 blog의 후기끼리 검색해 모으고, 각 후기를 최신순으로 불러오게 됨
CommentSchema.index({ blog: 1, createdAt: -1 });

const Comment = model("comment", CommentSchema);
module.exports = { Comment, CommentSchema };
