import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {  username:{
          type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true

      },
       email : {
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
       },
       fullName : {
        type:String,
        required:true,
        trim: true,
        index: true
       },
       password : {
        type:String,    
        required:[true, "Password is required"],
       },
       refreshToken : {
        type : String
       }
    },
    {
        timestamps: true,
    }
)

//pre-save hook to hash password before saving and if there is any change in password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return ;

    this.password =  await bcrypt.hash(this.password, 10);
    ;
})

//method to compare password during login
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//Access token are short lived tokens used for authenticating user requests to protected routes or resources.
//Refresh tokens are long lived tokens used to obtain new access tokens without requiring the user to re-authenticate.
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
        }
    )
   
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
        }
    )
}
   
const User = mongoose.model("User", userSchema);

export { User };