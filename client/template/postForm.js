import { Template } from 'meteor/templating';
import './main.html';

Template.postForm.events ({
  'submit form': function(event) {
    event.preventDefault();
    var content = document.getElementById('content').value;
    console.log(content);
    Post.insert({content: content, createdAt: new Date()});
    //document.getElementById('content').reset();
    event.target.reset();
  }
});
