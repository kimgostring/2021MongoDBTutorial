const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    // islive가 false면 임시저장, true면 게시 완료 (공개)
    islive: { type: Boolean, require: true, default: false },
    // 블로그 - 유저 관계 생김, 한 유저는 여러 블로그 사용 가능
    // 어떤 모델과 관계를 가지는지, ref를 통해 컬렉션명(단수)를 mongoose에게 알려줌
    user: { type: Types.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);

// 가상 필드 추가
BlogSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "blog",
});

BlogSchema.set("toObject", { virtuals: true });
BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);
module.exports = { Blog };
