const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
// const dateFormat = require('../utils/helpers') 
const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
    required: 'Please provide a pizza name!',
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtValAlias) => dateFormat(createdAtValAlias) //we'll use getters to transform the data by default every time it's queried.
  },
  size: {
    type: String,
    required: true,
    enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
    default: 'Large'
  },
  toppings: [],
  comments: [
      { 
        type: Schema.Types.ObjectId, // IMPORTANT type to be an ObjectId >> so that Mongoose knows to expect a comment?
        ref: 'Comment' // Tells the Pizza model which documents to search to find the right comments.
      }
    ] // The type of String is just a placeholder. We'll need to update it to refer to the Comment type that we've created.
  }, // end of 1st obj
  {
    // -- Tell the schema that it can use virtuals
    toJSON: { 
      virtuals: true, // reason, compute comment count 'virtually' see line 40 for more work
      getters: true
    },
    id: false // False because it is a virtual that Mongoose returns, and we don’t need it.
  }
);

 // -- Virtuals allow you to add virtual properties to a document that aren't stored  
 // -- in the database before responding to the API request: total count of comments 
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// // So that we can do:
// const pizza = await Pizza.findOne()
// pizza.commentCount // 5

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;