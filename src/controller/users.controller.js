const Io = require("../utils/Io");
const Users = new Io("./database/users.json");
const User = require("../model/users");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const Joi = require("joi");

const register = async (req, res) => {
  const {username, password} = req.body;

  const users = await Users.read();
  const scheme = joi.object({
    username: Joi.string().alphanum().min(6).required(),
      
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    
  });

  const { error } = scheme.validate({username,password});
  if (error) return res.status(400).json({ message: error.message });

  const findUser = users.find((user) => username === user.username);

  if (findUser)
    return res.status(409).json({message: "User already registered"});

  const id = (users[users.length - 1]?.id || 0) + 1;
  const newUser = new User(id, username, password);


  const data = users.length ? [...users, newUser] : [newUser];

  await Users.write(data);

  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({id: newUser.id}, secretKey);
  res.status(200).json({message: "Success", token});
};

const login = async (req, res) =>{
    const {username, password} = req.body;
    
  const users = await Users.read();

  const findUser = users.find((user) => username === user.username && password === user.password);

  if (!findUser)
    return res.status(409).json({message: "invalid username or password"});
    
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({id: findUser.id}, secretKey);

  res.status(200).json({message: "successfully logged in", token});

}
const allUsers = async (req, res) =>{
    const allUsers = await Users.read();
    res.status(200).json(allUsers);
}



module.exports ={
    register,
    login,
    allUsers,
   
   
}
