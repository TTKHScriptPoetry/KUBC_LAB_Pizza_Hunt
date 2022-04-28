const {Comment, Pizza} = require('../models');

const commentController = { 
   // action 1
   addComment({ params, body }, res) {
      console.log(body);
      Comment.create(body) // action
      .then(
            ({ _id }) => {
            //console.log(_id)
            return Pizza.findOneAndUpdate(
               { _id: params.pizzaId},
               // MongoDB built-in functions like $push start with a dollar sign ($) add { comments: _id} to the specific pizza 
               { $push: { comments: _id}}, //The $push method works just the same way that it works in JavaScript—it adds data to an array.
               { new: true} // expect to receive back the updated pizza (the pizza with the new comment included).
            );
      }) // end of 1st then
      .then (dbPizzaData => {
            if(!dbPizzaData){
               res.status(404).json({message: "No pizza found with this id!  Message brought by comment-controller"});
               return;
            }
            res.json(dbPizzaData);
      }) // end of 2nd then
      .catch(err => res.json(err));
   }, // end of addComment

   // action 2
   removeComment({ params}, res){
      Comment.findOneAndDelete({_id: params.commentId})
      .then(deletedComment => {
         if(!deletedComment){
            return res.status(404).json({message: "No comment with this Id"});
         }
         return Pizza.findByIdAndUpdate(
           {_id: params.pizzaId},
           { $pull: { comments: params.commentId}},
           { new: true} 
         );
      })
      .then(dbPizzaData => {
         if(!dbPizzaData){
            res.status(404).json({ message: "No pizza found with this id!"});
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
   } // end of removeComment

}; // end of controller

module.exports = commentController;