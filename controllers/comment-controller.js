const {Comment, Pizza} = require('../models');

const commentController = { 
   // action 1
   addComment({ params, body }, res) {
      Comment.create(body) // action
      .then(
            ({ _id }) => {            
            return Pizza.findOneAndUpdate(
               { _id: params.pizzaId},
               { $push: { comments: _id}}, //MongoDB built-in functions $push method works just the same way that it works in JavaScript—it adds data to an array.
               { new: true} // expect to receive back the updated pizza (the pizza with the new comment included).
            );
      }) // end of 1st then
      .then (dbPizzaData => {
            if(!dbPizzaData){
               res.status(404).json({message: "No pizza found with this id!  Brought by comment-controller"});
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
           { $pull: { comments: params.commentId}}, // use built-in method pull to pop the comment of matching Id out?
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
   }, // end of removeComment

   // action 3
   addReply({ params, body }, res) {
      Comment.findOneAndUpdate(
        { _id: params.commentId },
        { $push: { replies: body } },  // reply here
        { new: true }
      )
      .then(dbPizzaData => {
         if (!dbPizzaData) {
         res.status(404).json({ message: 'No pizza found with this id!' });
         return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
   },

   // // add reaction to thought
   // // addReaction({ params, body }, res) {
   // //    Thought.findOneAndUpdate(
   // //    { _id: params.thoughtId }, //
   // //    { $push: { reactions: body } }, 
   // //    { new: true }
   // //    )
   // //    .then(dbUserData => {
   // //       if (!dbUserData) {
   // //          res.status(404).json({ message: 'No thought found with this id to add reactions!' });
   // //          return;
   // //       }
   // //       res.json(dbUserData);
   // //    })
   // //    .catch(err => res.json(err));
   // // },
  
   // // action 4
   // // MongoDB $pull operator to remove the specific reply from the replies array 
   // // where the replyId matches the value of params.replyId passed in from the route
   // removeReply({ params }, res) {
   //    return Comment.findOneAndUpdate(
   //    { _id: params.commentId },
   //    { $pull: { replies: { replyId: params.replyId } } },  
   //    { new: true }
   //    )
   //    .then(dbPizzaData => res.json(dbPizzaData))
   //    .catch(err => res.json(err));
   // }

   removeReply({ params}, res){      
      return Comment.findByIdAndUpdate(
         {_id: params.commentId},
         { $pull: { replies: { replyId: params.replyId } } },  
         { new: true} 
      )      
      .then(dbCommentData => res.json(dbCommentData)
      )
      .catch(err => res.json(err));
   }, // end of removeReply

}; // end of controller


module.exports = commentController;