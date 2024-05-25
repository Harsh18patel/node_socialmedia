import { config } from "../config";
import { modal } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { otpService } from "../function/emailotp";

const useToken = (resData) => {
  return jwt.sign(
    { email: resData.email, userId: resData?._id },config.secret_key
  );
};

      export const create = async (req, res) => {
        let input = req.body;
        console.log("--input", req.body);

        try {
          const match = await modal?.User.findOne({
            $or: [{ email: input.email }, { password: input.password }],
          });
          console.log("--match-",match);

          if (match) return new Error( "email or password are used" );

          
          let user = await modal?.User.create(input);
          console.log("---user", user);


          let token = useToken(user);
          res.status(200).json({
            success: true,
            data: user,
            token,
            message: "User create successfully",
          });
        } catch (error) {
          console.log("--errr", error);
          res
          .status(400)
          .json({ success: false, data: null, message: error.message });
        }
      };

//   try {
//     const { email, password } = req.body;
    
//     // Validate email and password
//     if (!email || !password) {
//         throw new Error("Email and password are required");
//     }

//     // Check if user with email already exists
//     const existingUser = await modal.User.findOne({ email });
//     if (existingUser) {
//         throw new Error("Email already in use");
//     }

//     // Create new user
//     const user = await modal.User.create({ email, password });

//     // Send success response
//     res.status(200).json({ success: true, data: user, message: "User created successfully" });
// } catch (error) {
//     // Handle errors
//     console.error("Error in signUp:", error);
//     res.status(400).json({ success: false, message: error.message });
// }

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("🚀 ~ login ~  req.body:",  req.body)
  
      // Find the user by email or phone number
      const user = await modal.User.findOne({
        $or: [{ email: email }, { phoneNumber: email }]
      });
  
      // If user is not found, return 404 Not Found
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Validate the password
      const isPasswordValid = await user.validatePassword(password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
  
      // Generate authentication token
      const token = useToken(user);
  
      // Return success response with token and user data
      res.status(200).json({ success: true, message: "Login successful", token, user });
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error in login:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // Define an object to store user data
  export const getUserData = async (req, res) => {
    try {
      const { userId } = req.body;
  
      if (!userId) {
        throw new Error("User ID not provided");
      }
  
      // Assuming UserModel.findById returns a promise resolving to user data
      const userData = await modal.User.findById(userId);
  
      if (!userData) {
        throw new Error("User data not found");
      }
  
      const formattedUserData = {
        name: `${userData.firstName} ${userData.lastName}`,
        username: userData.username,
        email: userData.email,
        profilePicture: userData.profilePicture, // Include profile picture here
        // Add other necessary user data here if needed
      };
  
      res.status(200).json({ success: true, user: formattedUserData });
    } catch (error) {
      console.error("Error in getUserData:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  




  
  

export const logout = (req, res) => {
  localStorage.removeItem('token');
  res.status(200).send({ success: true, message: "Logout successful" });
};


export const resetPassword = async (req, res) => {
  let { newPassword, oldPassword } = req?.body;
  try {
    let isMatch = await bcrypt.compare(oldPassword, req?.me?.password);
    if (!isMatch) throw new Error("Old password is not match");
    req.me.password = newPassword;
    req.me.save();
    res
      .status(200)
      .send({ data: null, message: "Password chnage success", success: true });
  } catch (error) {
    res
      .status(400)
      .send({ data: null, message: error.message, success: false });
  }
};



export const otp = async(req,res)=>{
  const user = await modal?.User.findOne({ email: req?.body?.email });
  if (user) {
    let otp = otpService(user.email);
    console.log("---otps--",otp);
    user.OTP = otp;
    console.log("---user.otp",user.OTP);
    await user.save();
    res.send({ status: "200", data: user });
  } else {
    res.send({ status: "400", message: "User not found ...!" });
  }
};

export const forgetPassword = async (req,res) => {
    let { email , OTP , newPassword } = req?.body;
    try{
      const user = await modal?.User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "404", message: "User not found" });
    }

    if (user.OTP !== OTP) {
      return res.status(400).json({  message: "Invalid OTP" });
    }
    
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
    }
    catch(error){
      res.status(400).send({
        success:false,
        data:null,
        message: error.message
      })
    }
}


