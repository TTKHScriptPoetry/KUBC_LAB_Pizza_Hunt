const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(  
   {
      // http://localhost:3003/api/comments/commentId/replies/
     // set custom id to avoid confusion with parent comment _id
     replyId: {
       type: Schema.Types.ObjectId,
       default: () => new Types.ObjectId() // reason to import Type
     },
     replyBody: {
       type: String,
       required: 'It appears you have not provided a reply, it cannot be empty!', 
       trim: true
     },
     writtenBy: {
       type: String, 
       require: true,
       trim: true
     },
     createdAt: {
       type: Date,
       default: Date.now,
       get: createdAtVal => dateFormat(createdAtVal)
     }
   },
   {
      toJSON: { 
         getters: true
      }
  }
);
 
const CommentSchema = new Schema(
   {  
      commentBody: {
         required: 'Comment cannot be empty!',
         trim: true,
         type: String
      },
      writtenBy: {
         required: true,
         trim: true,
         type: String
         },
      createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtValAlias) => dateFormat(createdAtValAlias)
      },
      // use ReplySchema to validate data for a reply
      replies: [ReplySchema]  // no reference ?
   },
   {
      // -- Tell the schema that it can use virtuals
      toJSON: { 
         virtuals: true,
         getters: true
      },
      id: false // False because it is a virtual that Mongoose returns, and we don’t need it.
   }
);

CommentSchema.virtual('replyCount').get(function() {
   return this.replies.length;
  //  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
 });

const Comment = model('Comment', CommentSchema);

module.exports = Comment;