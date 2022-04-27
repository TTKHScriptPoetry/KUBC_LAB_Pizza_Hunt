const {
   getAllPizza,
   getPizzaById,
   createPizza,
   updatePizza,
   deletePizza
 } = require('../../controllers/pizza-controller');

const { get } = require('../html/html-routes');

const router = require('express').Router();

// router.route('/')
//       .get()
//       .post();

// router.route('/:id')      
//       .get()
//       .put()
//       .delete();

// /api/pizzas
router.route('/')
      .get(getAllPizza)
      .post(createPizza);      

// /api/pizzas/:id
router.route('/:id')
      .get(getPizzaById)
      .put(updatePizza)
      .delete(deletePizza);  

module.exports = router;      
