import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../helpers/sendEmail.js";
import crypto from "crypto";
import bcrypt from 'bcryptjs'
import { generateToken } from "../helpers/generateToken.js";
import dotenv from 'dotenv'
dotenv.config()



export const signup = asyncHandler(async(req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error("Password should be at least 8 characters");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(409);
      throw new Error("User already exists");
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({ _id: user.id, username: user.username, email: user.email, message: "User registered successfully" });
    } else {
      res.status(400);
      throw new Error("Invalid user details");
    }

});



//login
export const login = asyncHandler(async(req, res) => {
  const {email, password} = req.body

  const user = await User.findOne({email})

  if(user) {
      const check = await bcrypt.compare(password, user.password)

      if(check) {
          //generate jwt token
          const token = generateToken(user._id)

          //set cookies for subsequent requests
          // res.cookie("jwt", token, {httpOnly: true})
          res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

          res.status(200).json({
              _id: user._id,
              email: user.email,
              message: "Login successful"
          })

      } else {
          res.status(401)
          throw new Error("Wrong email or password entered")
      }
  } else {
      res.status(401)
      throw new Error("Wrong email or password entered")
  }
})



//logging out
export const logout = (req, res) => {
  // res.cookie("jwt", " ", {maxAge: -1})
  res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
  res.sendStatus(200)
}


//changing an existing password
export const changePassword = asyncHandler(async (req, res) => {
 
  // Log user's ID from req.user to know if user is in the db
  console.log('User ID from req.user:', req.user.id); 

  console.log('Attempting to find user by ID...');
  const user = await User.findById(req.user.id);
  // Log the user details
  console.log('User found:', user); 

  // const user = await User.findById(req.user._id);
  // console.log(user)

  if(!user) {
    res.status(404)
    throw new Error('User not found')
  }
  
  const {currentPassword, newPassword} = req.body
  
  const checkPassword = await bcrypt.compare(currentPassword, user.password)
  
  if(!checkPassword) {
      res.status(403)
      throw new Error('password provided is invalid')
  }
  
  if(currentPassword === newPassword) {
      res.status(400);
      throw new Error('password should not be same as old password')
  }
  
  const salt = await bcrypt.genSalt(10);
  
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  
  user.password = hashedPassword;
  
  await user.save()
  
  res.status(200).json({message: 'Password changed successfully'})
  
  
  })




  //sending a forgot password email
//   export const forgotPassword = asyncHandler(async (req, res) => {
//     const { email } = req.body;
  
//     //check if user exists in the db
//     const user = await User.findOne({ email });
  
//     // const user = new User()
  
//     if (user) {
//       const token = user.generatePasswordToken();
  
//       // await user.save();
//       await user.save({ validateBeforeSave: false });
  
//       //when using cors with frontend
//       // const emailUrl = `http:localhost:5173/forgot-password/${token}`; 
//       // const emailUrl = `http:localhost:5173/reset-password/${token}`;

//       //when using postman
//       // const emailUrl = `http://localhost:9000/api/users/forgot-password/${token}`;ii
//        const emailUrl = `http://localhost:9000/api/users/reset-password/${token}`;

  
//       const message = `We have received a request from your account for a password reset.
//            Kindly follow the link below \n ${emailUrl} \n This link expires in 15 minutes. Kindly ignore this message if you didn't request a password reset or call support for assistance`;
  
//       const options = {
//         email: user.email,
//         subject: "Password reset request",
//         text: message,
//       };
  
//       const send = await sendEmail(options);
  
//       if (send) {
//         res.status(200).json({ message: "Email success", send });
//       } else {
//         res.status(500);
//         throw new Error("Email could not be sent");
//       }
//     } else {
//       res.status(404);
//       throw new Error("Email not found, please sign up");
//     }
//   });




//   //password reset
// export const resetPassword = asyncHandler(async (req, res) => {
//   const { token } = req.params;

//   const isSame = crypto.createHash("sha256").update(token).digest("hex");

//   console.log('isSame', { isSame });

//   const user = await User.findOne({
//     passwordResetToken: isSame,
//     passwordResetTokenExpires: { $gt: Date.now() }});

//     console.log('User found:', user);

//   if (!user) {
//     res.status(400);
//     throw new Error("Token is invalid or expired");
//   }

//   const salt = await bcrypt.genSalt(10);

//   const hashedPassword = await bcrypt.hash(req.body.password, salt);

//   //user.password = req.body;
//   user.password = hashedPassword;
//   user.passwordResetToken = undefined;
//   user.passwordResetTokenExpires = undefined;

//   await user.save();

//   res.status(200).json({ message: "password changed successfully" });
// });





export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists in the db
  const user = await User.findOne({ email });

  if (user) {
    const token = user.generatePasswordToken();
    await user.save({ validateBeforeSave: false });

    // When using Postman
    const emailUrl = `http://localhost:9000/api/users/reset-password/${token}`;

    const message = `We have received a request from your account for a password reset.
      Kindly follow the link below \n ${emailUrl} \n This link expires in 15 minutes. Kindly ignore this message if you didn't request a password reset or call support for assistance`;

    const options = {
      email: user.email,
      subject: "Password reset request",
      text: message,
    };

    const send = await sendEmail(options);

    if (send) {
      res.status(200).json({ message: "Email sent successfully", send });
    } else {
      res.status(500);
      throw new Error("Email could not be sent");
    }
  } else {
    res.status(404);
    throw new Error("Email not found, please sign up");
  }
});






export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log('hashedToken:', { hashedToken });

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  console.log('User found:', user);

  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or expired");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});









  export default {
    signup,
    login,
    logout,
    changePassword,
    forgotPassword,
    resetPassword
  }