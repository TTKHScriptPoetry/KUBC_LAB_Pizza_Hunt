const { Pizza } = require('../models');

const pizzaController = {
   // these methods will be used as the callback functions for the Express.js routes,
   //  each will take two parameters: req and res.
   getAllPizza(req, res) {
      Pizza.find({})
          // To populate a field, just chain the .populate() method 
         .populate({ 
            path: 'comments', // passing in an object with the key path 
            select: '-__v' // minus sign (don't return) - tell Mongoose that we don't care about the __v field on comments either
         })
         .select('-__v') // minus sign - tell Mongoose that we don't care about the __v field on the pizza 
         .sort({ _id: -1 }) // sort in DESC order by the _id value
         .then(dbPizzaData => res.json(dbPizzaData))
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
      });
   },
   
   // get one pizza by id
   getPizzaById({ params }, res) {
      Pizza.findOne({ _id: params.id })
      .populate({
         path: 'comments',
         select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
         // If no pizza is found, send 404
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      });
   },
  
   // handling POST /api/pizzas 
   // createPizza
   createPizza({ body }, res) {
      Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
   },

   // make a request to PUT /api/pizzas/:id.
   // update pizza by id
   updatePizza({ params, body }, res) {
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) //we're instructing Mongoose to return the new version of the document.
      .then(dbPizzaData => {
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
   },

   // make a request to DELETE /api/pizzas/:id.
   // delete pizza
   deletePizza({ params }, res) {
      Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
   }

};

module.exports = pizzaController;