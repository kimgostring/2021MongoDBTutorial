const { Router } = require("express");
const { Blog } = require("../models/Blog");

const BlogRouter = Router();

BlogRouter.post("/", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

BlogRouter.get("/", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

BlogRouter.get("/:blogId", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// put, 전체 수정
BlogRouter.put("/:blogId", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// patch, 부분적 수정
BlogRouter.patch("/:blogId/live", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

module.exports = { BlogRouter };
