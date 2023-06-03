class Todo {
    constructor(id, title, text, author, user_id) {
      this.id = id;
      this.title = title;
      this.text = text;
      this.author = author;
      this.user_id = user_id;
      this.usersId = [];
      this.views = 0;
      this.created = new Date();
    }
  }
  
  module.exports = Todo;
  