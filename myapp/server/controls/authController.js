const bcrypt = require('bcrypt')
const UserModel = require("../models/Users")
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const RideModel = require('../models/Rides')

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
const HostRide = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { from, to, date, openseats, phone, message, preferences } = req.body;

    if (!from || !to || !date || !openseats || !phone || !preferences) {
      return res.status(400).json({ error: "Please enter all fields!" });
    }
    const rideMessage = message || `Ride from ${from} to ${to}. Seats available: ${openseats}.`;

    const createRide = await RideModel.create({
      user: userId,
      from,
      to,
      rideDate: date,
      openseats,
      phone,
      message: rideMessage,
      preferences,
    });

    return res.status(201).json({
      message: "Ride hosted!",
      rideDetails: {
        id: createRide._id,
        from: createRide.from,
        to: createRide.to,
        date: createRide.rideDate,
        openseats: createRide.openseats,
        phone: createRide.phone,
        message: createRide.message,
        preferences: createRide.preferences,
      },
    });
  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).json({ error: "Server error. Try again later." });
  }
};

const FindRide = async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Please login first." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { from, to, date } = req.body;

      const query = {
        user: { $ne: userId }, // exclude current user's own rides
      };

      if (from) query.from = new RegExp(`^${from}$`, 'i');
      if (to) query.to = new RegExp(`^${to}$`, 'i');
      if (date) {
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(searchDate.getDate() + 1);
        query.rideDate = { $gte: searchDate, $lt: nextDay };
      }

      const rides = await RideModel.find(query).populate("user", "name");

      console.log("Backend response data:", rides);

      res.status(200).json({ rides });
    } catch (err) {
      console.error("FindRide error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }

  const FindMyRides = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { from, to, date } = req.body;

    const query = {
      user: userId,
    };

    if (from) query.from = new RegExp(`^${from}$`, 'i');
    if (to) query.to = new RegExp(`^${to}$`, 'i');
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(searchDate.getDate() + 1);
      query.rideDate = { $gte: searchDate, $lt: nextDay };
    }

    const rides = await RideModel.find(query).populate("user", "name");

    console.log("My Hosted Rides:", rides);

    res.status(200).json({ rides });
  } catch (err) {
    console.error("FindMyRides error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const logoutUser = async (req, res) => {

  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
    
};

const sendRequest = async (req, res) => {
    const { token } = req.cookies;
    const { rideId } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Please login first." });
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const ride = await RideModel.findById(rideId);  //find the ride in database

    if(!ride) return res.status(404).json({error:"Ride not found!"})
    
    if(ride.requests.includes(userId) || ride.passengers.includes(userId)){
      return res.status(400).json({error: "Already requested or joined!"})
    }

    ride.requests.push(userId);
    await ride.save(); //saves new document updates
    return res.status(200).json({ message: "Request sent successfully" });

  } catch (err) {
    console.error("Rides error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const MyRideRequests = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const rides = await RideModel.find({ user: userId }).populate("requests", "name email");

    const pendingRequests = rides
      .filter(ride => ride.requests.length > 0)
      .map(ride => ({
        rideId: ride._id,
        from: ride.from,
        to: ride.to,
        rideDate: ride.rideDate,
        requests: ride.requests.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email
        }))
      }));
    return res.status(200).json({ pendingRequests });

  } catch (err) {
    console.error("Requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const ApproveRequest = async (req, res) => {
  const { rideId, userId } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const ride = await RideModel.findById(rideId);

  if (!ride) return res.status(404).json({ error: "Ride not found" });
  if (ride.user.toString() !== decoded.id) {
    return res.status(403).json({ error: "Unauthorized user" });
  }

  if (!ride.requests.includes(userId)) {
    return res.status(400).json({ error: "User has not requested" });
  }

  ride.requests = ride.requests.filter(r => r.toString() !== userId);
  ride.passengers.push(userId);
  ride.openseats -= 1;

  await ride.save();
  return res.json({ message: "Request approved" });
};

const DenyRequest = async (req, res) => {
  const { rideId, userId } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const ride = await RideModel.findById(rideId);

  if (!ride) return res.status(404).json({ error: "Ride not found" });
  if (ride.user.toString() !== decoded.id) {
    return res.status(403).json({ error: "Unauthorized user" });
  }

  if (!ride.requests.includes(userId)) {
    return res.status(400).json({ error: "User has not requested" });
  }

  if (ride.passengers.includes(userId)) {
    return res.status(400).json({ error: "User is already a passenger" });
  }

  ride.requests = ride.requests.filter(r => r.toString() !== userId);
  await ride.save();

  return res.json({ message: "Request denied" });
};

const MyRequests = async (req, res) => {

  const { userId } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }
  
  try{
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //search all rides that have the user, either as a request or passenger
  const rides = await RideModel.find({
      $or: [
        { requests: userId },
        { passengers: userId },
      ]
    }).populate("name email");
  
  if(!rides) return res.json({message: "No rides requested!"})

  const result = rides.map(ride => {
      let status = "Pending";

      if (ride.passengers.includes(userId)) status = "Approved";
      else if (!ride.requests.includes(userId)) status = "Denied";

      return {
        from: ride.from,
        to: ride.to,
        date: ride.rideDate,
        host: ride.user.name,
        status,
      };
    });

    return res.json({ rides: result})
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

};

module.exports = {
    test,
    loginUser,
    registerUser,
    getProfile,
    HostRide,
    FindRide,
    FindMyRides,
    logoutUser,
    sendRequest,
    MyRideRequests,
    ApproveRequest,
    DenyRequest,
    MyRequests,

};
