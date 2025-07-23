const bcrypt = require('bcrypt')
const UserModel = require("../models/Users")
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const RideModel = require('../models/Rides')
const ChatRoomModel = require('../models/ChatRoom')
const MessageModel = require('../models/Message')

function test(req, res) {
    console.log("Test function!");
    res.json({ message: "Test route working" });
}

const Testing = async(req, res) => {
  try {
    const coords = await getCoords("New York");
    res.json(coords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch coords" });
  }
};

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

  function toRadians(deg) {
  return deg * Math.PI / 180;
    }

  async function getCoords(place) {
  const apiKey = '6b6ea9be10c57dbca77e8c8a90ff1dca';
  const url = new URL('https://api.openweathermap.org/geo/1.0/direct');
  url.search = new URLSearchParams({
    q: place,
    limit: '1',     // get the top result
    appid: apiKey
  });


  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();

    if (!data.length) {
      throw new Error(`No results for "${place}"`);
    }

    const { lat, lon } = data[0];
    return { lat, lng: lon };
  }


  function haversineDistance(lat1, lon1, lat2, lon2, R = 6371) {
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
    const φ1 = toRadians(lat1), φ2 = toRadians(lat2);

    const x = Math.sin(Δφ/2)**2 +
              Math.cos(φ1)*Math.cos(φ2) *
              Math.sin(Δλ/2)**2;
    const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

    return R * y; // distance in kilometers
    }

const HostRide = async (req, res) => {
  const { token } = req.cookies;
  console.log("Received body:", req.body);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { from, to, date, openseats, phone, message, preferences, intermediateStops } = req.body;

    // Validate required fields
    if (!from || !to || !date || !openseats || !phone || !preferences) {
      return res.status(400).json({ error: "Please enter all fields!" });
    }

    const rideMessage = message || `Ride from ${from} to ${to}. Seats available: ${openseats}.`;

    // Get coordinates for origin and destination
    const coords_from = await getCoords(from);
    const coords_to = await getCoords(to);

    // Validate geocoding response
    if (
      !coords_from || !coords_to ||
      isNaN(coords_from.lat) || isNaN(coords_from.lng) ||
      isNaN(coords_to.lat) || isNaN(coords_to.lng)
    ) {
      console.error("Invalid coordinates returned:", { coords_from, coords_to });
      return res.status(500).json({ error: "Geocoding failed for from/to locations." });
    }

    // Geocode intermediate stops with validation
    const stopsWithCoords = await Promise.all(
      intermediateStops.map(async (stop) => {
        const coords = await getCoords(stop.address);
        if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) {
          throw new Error(`Invalid intermediate stop: ${stop.address}`);
        }
        return {
          address: stop.address,
          lat: coords.lat,
          lng: coords.lng,
        };
      })
    );

    // Build route: from → intermediateStops → to
    const routePoints = [
      { lat: coords_from.lat, lng: coords_from.lng },
      ...stopsWithCoords,
      { lat: coords_to.lat, lng: coords_to.lng },
    ];

    // Calculate total distance with Haversine
    let totalDistance = 0;
    for (let i = 0; i < routePoints.length - 1; i++) {
      const a = routePoints[i];
      const b = routePoints[i + 1];
      totalDistance += haversineDistance(a.lat, a.lng, b.lat, b.lng);
    }

    // Validate final distance
    if (isNaN(totalDistance)) {
      console.error("Distance calculation failed:", routePoints);
      return res.status(500).json({ error: "Failed to calculate route distance." });
    }

    // Save to DB
    const createRide = await RideModel.create({
      user: userId,
      from,
      to,
      rideDate: date,
      distance: totalDistance,
      openseats,
      phone,
      message: rideMessage,
      preferences,
      intermediateStops: stopsWithCoords,
      fromCoords: {
        lat: coords_from.lat,
        lng: coords_from.lng,
      },
      toCoords: {
        lat: coords_to.lat,
        lng: coords_to.lng,
      }
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
        fromCoords: createRide.fromCoords,
        toCoords:createRide.toCoords,
        intermediateStops: createRide.intermediateStops,
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

    //case: user can't ride two rides on the same day
    const rides = await RideModel.find();

    const date = new Date(ride.rideDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const conflictingRides = await RideModel.find({
        $or: [
          { passengers: userId },
          { requests: userId }
        ],
        rideDate: { $gte: startOfDay, $lte: endOfDay }
      });

    
    if (conflictingRides.length > 0) {
          return res.status(400).json({ error: " Already have a ride or request on this day." });
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

  try {
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

    if (ride.openseats === 0) {
      return res.json({ message: "No open seats" });
    }

    // Approve request
    ride.requests = ride.requests.filter(r => r.toString() !== userId);
    ride.passengers.push(userId);
    ride.openseats -= 1;

    // Add to chat room
    const chatRoom = await ChatRoomModel.findOne({ ride: rideId });
    if (chatRoom) {
      if (!chatRoom.participants.map(p => p.toString()).includes(userId)) {
        chatRoom.participants.push(userId);
        await chatRoom.save();
      }
    }

    await ride.save();
    return res.json({ message: "Request approved" });

  } catch (err) {
    console.error("ApproveRequest error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


const DenyRequest = async (req, res) => {
  const { rideId, userId } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  try{

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const ride = await RideModel.findById(rideId);
  console.log({ rideId, userId });

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
}catch(err){
  console.log(err)
  return res.json({error: "Server error"})
}
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

const MyDashboardRides = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const ridesHosting = await RideModel.find({ user: userId }).populate('requests passengers', 'name email');
    const ridesRequested = await RideModel.find({ requests: userId }).populate('user', 'name email');
    const ridesPassenger = await RideModel.find({ passengers: userId }).populate('user', 'name email');

    res.json({ ridesHosting, ridesRequested, ridesPassenger });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const ChatMembers = async(req,res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const rides = await RideModel.find({ user: userId }).populate('requests passengers', 'name email');

    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const HostedRides= async(req,res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const rides = await RideModel.find({ user: userId }).populate('passengers', 'name email');

    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getMyRides = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const rides = await RideModel.find({
      $or: [
        { user: userId },
        { passengers: userId }
      ]
    })
    .populate('passengers', 'name email')
    .populate('user', 'name email'); // ⬅️ populate host too

    res.json({ rides });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const createChatRoom = async (req, res) => {
  const { rideId } = req.body;
  console.log("Received rideId for chat creation:", rideId);
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const ride = await RideModel.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    if (ride.chatCreated) {
      return res.status(400).json({ error: "Chat room already created" });
    }

    if (ride.user.toString() !== userId) {
      return res.status(403).json({ error: "Only the host can create the chatroom" });
    }

    const chat = await ChatRoomModel.create({
      ride: rideId,
      participants: [ride.user, ...ride.passengers],
    });

    ride.chatCreated = true;
    await ride.save();

    if (!chat) return res.json({ message: "Unable to create chatroom! Try again." });

    res.json({ message: "Created chatroom!" });
  } catch (err) {
    console.error("Chat room creation failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const myChatRooms = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all chat rooms where the user is a participant
    const chatRooms = await ChatRoomModel.find({ participants: userId })
      .populate({
        path: "ride",
        populate: [
          { path: "user", select: "name email" },
          { path: "passengers", select: "name email" },
        ],
      });
    if (!chatRooms || chatRooms.length === 0) {
      return res.status(404).json({ message: "No chats found" });
    }
    return res.status(200).json({ message: "Chats fetched", chatRooms });
  } catch (err) {
    console.error("Fetching chat rooms failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const myMessages = async (req, res) => {
  const { token } = req.cookies;
  const { chatRoomId } = req.params;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const messages = await MessageModel.find({ ride: chatRoomId })
    .populate("sender", "name") 
    .sort({ timestamp: 1 });
    return res.json({ messages });
  } catch (err) {
    console.error("Fetching messaages failed:", err);
    return res.status(500).json({ error: "Server error" });
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
    MyDashboardRides,
    Testing,
    ChatMembers,
    HostedRides,
    getMyRides,
    createChatRoom,
    myChatRooms,
    myMessages,
};
