import { Template } from 'meteor/templating';
import './main.html';
import './useraccounts-configuration.js';
import { Session } from 'meteor/session';

Post = new Mongo.Collection('post');

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

Template.postForm.events ({
  'submit form': function(event) {
    event.preventDefault();
    var content = document.getElementById('submit-text').value;
    Meteor.call('addPost', content);
    event.target.reset();
  }
});

Template.postList.helpers ({
  posts: function() {
    var result;
    if (Session.get('username')) {
      result = Post.find({username: Session.get('username')}, {sort: {createdAt: -1}});
    } else {
      result = Post.find({}, {sort: {createdAt: -1}});
    }
    return result;
  }
});

Template.postList.events ({
  'click .follow-link': function (event) {
    event.preventDefault();
    Meteor.call('follow', this);
  }
});

Template.profileArea.helpers ({
  following: function() {
    var user = Meteor.user();
    return user.profile.follow;
  },

  followers: function () {
    var user = Meteor.user();
    var followers = Meteor.users.find({'profile.follow': {$in: [user.username]}});
    return followers;
  }
});

Template.profileArea.events ({
  'click .filter-user': function (event) {
    event.preventDefault();
    var selectedUser = event.target.text;
    Session.set('username', selectedUser);
  },

  'click .community': function (event) {
    event.preventDefault();
    Session.set('username', null);
  }
});
