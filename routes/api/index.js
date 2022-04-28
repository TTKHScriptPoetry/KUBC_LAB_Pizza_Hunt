const pizzaRoutes = require('./pizza-routes');
const commentRoutes = require('./comment-routes');
const router = require('express').Router();

router.use('/pizzas', pizzaRoutes);
router.use('/comments', commentRoutes);

module.exports = router;