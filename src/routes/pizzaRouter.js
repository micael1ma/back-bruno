const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

router.get("/pizza", pizzaController.getPizzas);
router.post("/pizza", pizzaController.createPizza);
router.get("/allPizza", pizzaController.getAvailablePizzas);

module.exports = router;
