const {
  Schema,
  model,
  // 저번에 Blog.js에서 사용한 type: Types.ObjectId만을 따로 가져올 수 있음
  Types: { ObjectId },
} = require("mongoose");

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: "user" },
    blog: { type: ObjectId, required: true, ref: "blog" },
  },
  { timestamps: true }
);

const Comment = model("comment", CommentSchema);
module.exports = { Comment };
