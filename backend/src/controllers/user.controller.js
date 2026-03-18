import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User} from '../models/user.models.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessandRefreshToken = async(userId) => {
    try {
        
        const user = await User.findById(userId)

        if(!user){
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return{accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Error while generating Access or Refresh Tokens")
    }
}
const registerUser = asyncHandler(async(req, res) => {
    
    const {fullName, username, email, password} = req.body;
    // console.log("email: ", email); 

    if (
        [fullName, username, email, password].some((fields) => fields?.trim() === '')
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser){
        throw new ApiError(409, 'User already exists with this email or username')
    }

    // --- DB Creation ---
    const user = await User.create({
        fullName,
        username : username,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshTokens")

    if(!createdUser){
        throw new ApiError(500, 'User registration failed, please try again');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, 'User registered successfully')
    )
})

const loginUser = asyncHandler(async(req, res) => {
    //req body => data
    //username or email
    //password
    //access and refresh token
    //send cookies
    
    const {email, username, password} = req.body
    // console.log(email)

    if(!email && !username){
        throw new ApiError(400, "username or email id is required")
    }

    const user = await User.findOne({
        $or : [{username}, {email}]
    })
    
    if(!user){
        throw new ApiError(404, "user not found")
    }

    const validPassword = await user.isPasswordCorrect(password)

    if(!validPassword){
        throw new ApiError(404, "Enteer valid password")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",   // 🔥 MUST
        path: "/"
      };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully "
        )
    )

})

const loggedOutUser = asyncHandler(async(req, res) => {
   
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
           
        },
        {
            new: true
        }
    )

    console.log(req.user)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
      };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))

})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is used or expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",   // 🔥 MUST
            path: "/"
          };
    
       const {accessToken, newRefreshToken} = await generateAccessandRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access Token refreshed successfully"
        ))
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid Refresh Token")
    }


})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const{oldPassword, newPassword} = req.body
    
    const user = await User.findById(req.user?._id).select("+password")

    if(!user){
        throw new ApiError(404, "User not found")
    }   
    
    const isPasswordCorrect = await user.
    isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .set("Cache-Control", "no-store")
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))

})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if(!fullName || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email: email
            }

        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully" ))
})

export {    
    registerUser,
    loginUser, 
    loggedOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
};