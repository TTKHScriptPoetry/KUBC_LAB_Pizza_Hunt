const pizzaRoutes = require('./pizza-routes');
const router = require('express').Router();

router.use('/pizzas', pizzaRoutes);

module.exports = router;