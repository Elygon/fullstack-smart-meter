const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

//endpoint to Sign Up
router.post('/signup', async(req, res) =>{
    const {fullname, email, phone_no, password, confirm_password, gender} = req.body

    if(!fullname || !email || !phone_no || !password || !confirm_password)
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})

    // Start try block
    try {
        //Confirm passwords match
        if (password !== confirm_password) {
            return res.status(400).send({status: 'error', msg: 'Password mismatch'})
        }
        
        //Check if user already exists
        const check = await User.findOne({email: email})
        if(check) {
            return res.status(200).send({status: 'ok', msg: 'An account with this email already exists'})
        }

        //Hash password
        const hashedpassword = await bcrypt.hash(password, 10)

        //Create new user
        const user = new User()
        user.fullname = fullname
        user.email = email
        user.phone_no = phone_no
        user.password = hashedpassword
        user.confirm_password = hashedpassword


        //Only assigned gender if provided
        if (gender) {
            user.gender = gender
        }

        await user.save()

        return res.status(200).send({status: 'ok', msg: 'User registered successfully', user})
        
    } catch (error) {
        if(error.name == "JsonWebTokenError")
            return res.status(400).send({status: 'error', msg: 'Invalid token'})
    
        return res.status(500).send({status: 'error', msg:'An error occured during registration.', error})
    }
})

//endpoint to Login
router.post('/login', async(req, res) => {
    const {email, password} = req.body
    if (!email || !password)
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})

    try {
        // get user from database
        let user = await User.findOne({email}).lean()
        if(!user)
            return res.status(400).send({status: 'error', msg:'No user with the email found'})

        //compare password
        const correct_password = await bcrypt.compare(password, user.password)
        if(!correct_password)
            return res.status(400).send({status: 'error', msg:'Password is incorrect'})

        // create token
        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: '1h'})

        //update user document to online
        user = await User.findOneAndUpdate({email}, {is_online: true}, {new: true}).lean()

        //send response
        res.status(200).send({status: 'ok', msg: 'Login Successful', user, token})
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({status: 'error', msg:'An error occured'})  
    }
})

//endpoint to Logout
router.post('/logout', async(req, res) => {
    const {token} = req.body
    if(!token)
        return res.status(400).send({status: 'error', msg: 'Token is required'})

    try {
        //verify token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        await User.updateOne({_id: user._id}, {is_online: false})
        return res.status(200).send({status: 'ok', msg: 'Logout Successful'})
    } catch (error) {
        console.log(error)
        if(error == "JsonWebTokenError")
            return res.status(400).send({status: 'error', msg: 'Invalid token'})

        return res.status(500).send({status: 'error', msg:'An error occured'})    
    }
})

// endpoint to change password
router.post('/change_password', async(req, res)=>{
    const {token , old_password, new_password, confirm_new_password} = req.body

    //check if fields are passed correctly
    if(!token || !old_password || !new_password || !confirm_new_password){
       return res.status(400).send({status: 'error', msg: 'all fields must be filled'})
    }

    // get user document and change password
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)

        let Muser = await User.findOne({_id: user._id}).select("password")

        if (!Muser) {
            return res.status(400).send({status:'error', msg:'User not found'})
        }

        //Compare old password
        const check = await bcrypt.compare(old_password, Muser.password)
        if(!check){
            return res.status(400).send({status:'error', msg:'old password is incorrect'})
        }

        //Prevent reusing old password
        const isSamePassword = await bcrypt.compare(new_password, Muser.password)
        if(isSamePassword){
            return res.status(400).send({status:'error', msg:'New password must be different from the old password'})
        }

        //Confirm new passwords match
        if (new_password !== confirm_new_password) {
            return res.status(400).send({status: 'error', msg: 'Password mismatch'})
        }

        //Hash new password and update
        const updatePassword = await bcrypt.hash(confirm_new_password, 10)
        await User.findOneAndUpdate({_id: user._id}, {password: updatePassword})

        return res.status(200).send({status: 'successful', msg: 'Password successfully changed'})
    } catch (error) {
        if(error.name === 'JsonWebTokenError'){
        console.log(error)
        return res.status(401).send({status: 'error', msg: 'Token Verification Failed', error: error.message})
}
      return res.status(500).send({status: 'error', msg: 'An error occured while changing password', error: error.message})}
})


// endpoint for a member to reset their password
router.post('/forgot_password', async (req, res) => {
    const {email} = req.body;
  
    if(!email){
        return res.status(400).send({status: 'error', msg: 'All fields must be entered'});
    }
  
    try {
        // Add Regex for email check
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if(!regex.test(String(email).toLocaleLowerCase())){
        //     return res.status(400).json({status: 'error', msg: 'Please enter a valid email'});
        // }
    
        // check if the user exists
        const found = await User.findOne({email}, {fullname: 1, email: 1}).lean();
    
        if(!found){
            return res.status(400).send({status: 'error', msg: 'There is no user account with this email'});
        }
    
        // create resetPasswordCode
        /**
         * Get the current timestamp and use to verify whether the
         * user can still use this link to reset their password
        */
    
        const timestamp = Date.now();
        const resetPasswordCode = jwt.sign({ email, timestamp }, process.env.JWT_SECRET, { expiresIn: '10m' });
  
        //send email to user to reset password
        // send email to user to reset password
        try {
            await sendPasswordReset(email, found.fullname, resetPasswordCode);
            return res.status(200).json({ status: 'ok', msg: 'Password reset email sent, please check your email' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', msg: 'Email not sent', error: error.name });
        }
  
    } catch(e) {
        console.error(e);
        return res.status(500).send({status: "error", msg: "some error occured", error: e.name});
    } 
  })
  
  // endpoint to reset password webpage
  router.get("/reset_password/:resetPasswordCode", async (req, res) => {
    const resetPasswordCode = req.params.resetPasswordCode;
    try {
      const data = jwt.verify(resetPasswordCode, process.env.JWT_SECRET);
  
      const sendTime = data.timestamp;
      // check if more than 5 minutes has elapsed
      const timestamp = Date.now();
      if (timestamp > sendTime) {
        console.log("handle the expiration of the request code");
      }
  
      return res.send(`<!DOCTYPE html>
      <html>
          <head>
              <title>Forgot Password</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">    
              <style>
                  body {
                      font-family: Arial, Helvetica, sans-serif;
                      margin-top: 10%;
                  }
                  form{
              width: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 26%;
              margin-top: 0%;
          }
              @media screen and (max-width: 900px) {
                  form{
              width: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
                  }
              
  
              }
                  input[type=text]
              {
                      width: 100%;
                      padding: 12px 20px;
                      margin: 8px 0;
                      display: inline-block;
                      border: 1px solid #ccc;
                      box-sizing: border-box;
                  }
  
                  button {
                      background-color: #04AA6D;
                      color: white;
                      padding: 14px 20px;
                      margin: 8px 0;
                      border: none;
                      cursor: pointer;
                      width: 100%;
                  }
  
                  button:hover {
                      opacity: 0.8;
                  }   
  
                  .container {
                      padding: 16px;
                  }
  
                  span.psw {
                      float: right;
                      padding-top: 16px;
                  }
  
                  /* Change styles for span and cancel button on extra small screens */
                  @media screen and (max-width: 300px) {
                      span.psw {
                          display: block;
                          float: none;
                      }
  
                      .cancelbtn {
                          width: 100%;
                      }
                  }
              </style>
          </head>
          <body>    
                  <h2 style="display: flex; align-items: center; justify-content: center; margin-bottom: 0;">Recover Account</h2>
                  <h6 style="display: flex; align-items: center; justify-content: center; font-weight: 200;">Enter the new phone number
                      you want to use in recovering your account</h6>    
          
              <form action="http://localhost:3000/user_profile/reset_password" method="post">
                  <div class="imgcontainer">
                  </div>
                  <div class="container">
                      <input type="text" placeholder="Enter new password" name="new_password" required style="border-radius: 5px;" maxlength="11">
                      <input type='text' placeholder="nil" name='resetPasswordCode' value=${resetPasswordCode} style="visibility: hidden"><br>
                      <button type="submit" style="border-radius: 5px; background-color: #1aa803;">Submit</button>            
                  </div>        
              </form>
          </body>
  
      </html>`)
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
          // Handle general JWT errors
          console.error('JWT verification error:', e.message);
          return res.status(401).send(`</div>
          <h1>Password Reset</h1>
          <p>Token verification failed</p>
          </div>`);
        } else if (e.name === 'TokenExpiredError') {
          // Handle token expiration
          console.error('Token has expired at:', e.expiredAt);
          return res.status(401).send(`</div>
          <h1>Password Reset</h1>
          <p>Token expired</p>
          </div>`);
        } 
      console.log(e);
      return res.status(200).send(`</div>
      <h1>Password Reset</h1>
      <p>An error occured!!! ${e.message}</p>
      </div>`)
    }
  })
  
  // endpoint to reset password
  router.post("/reset_password", async (req, res) => {
    const { new_password, resetPasswordCode } = req.body;
  
    if (!new_password || !resetPasswordCode) {
      return res
        .status(400)
        .json({ status: "error", msg: "All fields must be entered" });
    }
  
    try {
      const data = jwt.verify(resetPasswordCode, process.env.JWT_SECRET);
      const password = await bcrypt.hash(new_password, 10)
  
      // update the phone_no field
      await User.updateOne(
        { email: data.email },
        {
          $set: { password },
        }
      );
  
      // return a response which is a web page
      return res.status(200).send(`</div>
      <h1>Reset Password</h1>
      <p>Your password has been reset successfully!!!</p>
      <p>You can now login with your new password.</p>
      </div>`);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
          // Handle general JWT errors
          console.error('JWT verification error:', e.message);
          return res.status(401).send(`</div>
          <h1>Password Reset</h1>
          <p>Token verification failed</p>
          </div>`);
        } else if (e.name === 'TokenExpiredError') {
          // Handle token expiration
          console.error('Token has expired at:', e.expiredAt);
          return res.status(401).send(`</div>
          <h1>Password Reset</h1>
          <p>Token expired</p>
          </div>`);
        } 
      console.log("error", e);
      return res.status(200).send(`</div>
      <h1>Reset Password</h1>
      <p>An error occured!!! ${e.message}</p>
      </div>`)
    }
  })

//endpoint to delete account
router.post('/delete', async(req, res) => {
    const {token} = req.body
    if(!token)
        return res.status(400).send({status: 'error', msg: 'Token is required'})

    try {
        //verify token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Find the user and delete the account
        const Duser = await User.findByIdAndDelete(user._id)

        //Check if the user exists and was deleted
        if(!Duser)
            return res.status(400).send({status: 'error', msg: 'No user Found'})

        return res.status(200).send({status: 'ok', msg: 'Account Successfully deleted'})

    } catch (error) {
        console.log(error)

        if(error == "JsonWebTokenError")
            return res.status(400).send({status: 'error', msg: 'Invalid token'})

        return res.status(500).send({status: 'error', msg:'An error occured'})    
    }

})

module.exports = router