const { Router } = require("express");
const {
  blogAdd,
  update,
  blogView,
  delate,
  showAll,
  blogCountView
} = require("../controller/blogs.controller");

const router = Router();

router.post("/blogAdd", blogAdd);
router.post("/update", update);
router.get("/blogView", blogView);
router.post("/delate/:id", delate);
router.get("/showAll", showAll);
router.post("/blogCountView", blogCountView);

module.exports = router;
