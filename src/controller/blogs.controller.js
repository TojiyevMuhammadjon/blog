const Io = require("../utils/Io");
const Blogs = new Io("./database/blogs.json");
const Users = new Io("./database/users.json");
const Blog = require("../model/blogs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const blogAdd = async (req, res) => {
  const { title, text , author} = req.body;
  
  try {
    
    const blogs = await Blogs.read();
    const token = req.headers.authorization.split(" ")[1];
    const {id: user_id} = jwt.verify(token, secretKey);
    const id = (blogs[blogs.length - 1]?.id || 0) + 1;
    const newBlog = new Blog(id, title, text,author, user_id);
    
    const data = blogs.length ? [...blogs, newBlog] : [newBlog];
    await Blogs.write(data);
    
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};


const showAll = async (req, res)=> {
    const blog = await Blogs.read();
    res.status(200).json(blog);
};

const delate = async (req, res) => {
  const { id } = req.params;
  const blogs = await Blogs.read();
  const token = req.headers.authorization.split(" ")[1];

  const {id: user_id} = jwt.verify(token, secretKey);
  const findBlog = blogs.find((blog) => id == blog.id && user_id == blog.user_id);

  if (!findBlog) {
    return res.status(404).json({ error: "Blog or token have mistake" });
  }


    const data = blogs.filter(blog => blog !== findBlog);
    await Blogs.write(data);
    res.status(200).json({ message: "Deleted successfully" });
  
};

const update = async (req, res)=> {
  const { id , title, text} = req.body;
  const blogs = await Blogs.read();
  const token = req.headers.authorization.split(" ")[1];

  const {id: user_id} = jwt.verify(token, secretKey);
  const findBlog = blogs.find((blog) => id == blog.id && user_id == blog.user_id);

  if (!findBlog) {
    return res.status(404).json({ error: "Nor found Blog or token have mistake" });
  }

  const newBlog = new Blog(id, title, text, user_id);
  
  const data = blogs.length ? [...blogs, newBlog] : [newBlog];
  // await Blogs.write(data);
  
  const dataBlog = blogs.filter(blog => blog !== data);
  await Blogs.write(dataBlog);
  
  res.status(201).json({ message: "Success" });
};

const blogView = async (req, res)=> {

    const {id: user_id} = jwt.verify(
        req.headers.authorization.split(" ")[1],
        secretKey
      );
    
     
    
      const blogs = await Blogs.read();
    
      const myBlogs = blogs.filter((blogs) => blogs.user_id === user_id);
      const users = await Users.read();
      const findUser = users.find((user) => user.id == user_id);
      const allBlogs = myBlogs.map((blog) => {
        blog.user_id = findUser;
        return blog;
      });
    
      res.status(200).json({blogs: allBlogs});
};

const blogCountView = async (req, res) => {
  const { id } = req.body;

  const { id: user_id } = jwt.verify(
    req.headers.authorization.split(" ")[1],
    secretKey
  );

  try {
    const blogs = await Blogs.read();

    const myBlog = blogs.find((blog) => blog.id === id);

    if (!myBlog) {
      res.status(404).json({ message: "Not Found" });
    } else {
      if (!myBlog.usersId) {
        myBlog.usersId = []; 
      }

      const isUserViewed = myBlog.usersId.some((userId) => userId === user_id);

      if (isUserViewed) {
        res.status(200).json({ message: "Success", myBlog });
      } else {
        myBlog.views += 1;
        myBlog.usersId.push(user_id);
        await Blogs.write(blogs); 
        res.status(200).json({ message: "Success", myBlog });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports ={
    blogAdd,
    update,
    blogView,
    delate,
    showAll,
    blogCountView
}
