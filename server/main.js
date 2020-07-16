import { Meteor } from 'meteor/meteor';
Post = new Mongo.Collection('post');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  addPost: function (content){
    if (!Meteor.userId()) {
      throw new Meteor.Error('Sign in to access the account');
    }
    var username = Meteor.user().username;
    Post.insert({
      content: content,
      createdAt: new Date(),
      username: username
    });
  },

  follow: function(post) {
    console.log(post);
    var user = Meteor.user();
    if(!user) {
      //throw new Meteor.Error('User does not exist.', ' Please sign-in');
    }
    if (user.username != post.username && user.profile.follow.indexOf(post.username) == -1) {
      Meteor.users.update(
        {_id: user._id},
        {$push: {'profile.follow': post.username}
      });
    }
  }
});

Accounts.onCreateUser (function (options, user ){
  user.profile = user.profile || {};
  user.profile.follow = [];
  return user;
});
