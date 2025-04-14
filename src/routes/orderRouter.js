const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/auth");

router.post("/createOrder", authMiddleware, orderController.createOrder);

router.get(
  "/summaries/search",
  authMiddleware,
  orderController.searchBySummary
);
router.get("/summaries", authMiddleware, orderController.getAllSummaries);

module.exports = router;
