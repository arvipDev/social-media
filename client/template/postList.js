import { Template } from 'meteor/templating';
import './main.html';

Template.postList.helpers ({
  posts: function() {
    return Post.find();
  }
});
