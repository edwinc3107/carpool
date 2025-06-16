const bcrypt = require('bcrypt')
const UserModel = require("../models/Users")
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')

function test(req, res) {
    console.log("Test function!");
    res.json({ message: "Test route working" });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.json({ error: "Please enter all fields" });
        }

        const exist = await UserModel.findOne({ email });
        if (exist) {
            return res.json({ error: "Email is already taken, try a different one!" });
        }

        const password_hash = await bcrypt.hash(password, 10); 

        const user = await UserModel.create({
            name,
            email,
            password: password_hash
        });

        return res.json({
            message: "Successfully registered!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (err) {
        console.log("Error occurred:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({ error: "Please enter all fields" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ error: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ error: "Invalid credentials!" });
        }
        
        const jwtSign = jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET,{}, (err, token) =>{
            if (err){throw err}
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
                }).json(user)
        })
    } catch (err) {
        console.log("Error occurred:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const getProfile = async(req, res) =>{
  const { token } = req.cookies;

  if (!token) {
    return res.json(null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("-password"); // exclude password
    res.json(user);
  } catch (err) {
    console.log("JWT error:", err);
    res.status(403).json({ error: "Token invalid or expired" });
  }
};
module.exports = {
    test,
    loginUser,
    registerUser,
    getProfile
};
