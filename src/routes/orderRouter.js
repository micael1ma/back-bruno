const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/auth");

router.post("/createOrder", orderController.createOrder);

router.get(
  "/summaries/search",
  
  orderController.searchBySummary
);
router.get("/summaries", orderController.getAllSummaries);

module.exports = router;
