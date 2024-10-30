import mongoose from "mongoose";
import { User , UserProfile, UserInfo, UserCredential} from "../model/User";
import fs from 'fs';
import { userInfo } from "os";
import "dotenv/config";

const uri = process.env.MONGODB_URI as string;

mongoose.connect(uri, {dbName: 'User', serverSelectionTimeoutMS: 5000});

export const create = async (username : string, email: string, password: string) => {
    try{
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(existingUser){
            // mongoose.disconnect();
            return -2;
        }
        console.log("Current working directory:", process.cwd());
        const newUser = new User({username: username,email:email,password:password, 
            icon: fs.readFileSync('../Foodie/assets/rasberry.png')})
        await newUser.save();
        console.log("You have successfully registered, ", username);
        // mongoose.disconnect();
        return newUser._id;
    } catch (err) {
        console.error('Error occurred:', err);
        // mongoose.disconnect();
        return -1;
    }
    
};

export const login = async (username : string, password: string) => {
    let res = '-1';
    try{
        const user:UserCredential|null = await User.findOne({
            $or: [{ username }, { email: username }],
            password: password
        });
        if(user){
            console.log("You have successfully logged in, ", user.username );
            res = user._id.toString();
        }
        else{
            res = '-1';
        }
        
    } catch (err) {
        console.error('Error occurred:', err);
        res = '-2';
    } finally {
        return res;
    }
    
};

export const get = async (uid : string) => {
    try{
        const user = await UserProfile.findById(uid).select('username googleId email allergies favFoods favDrinks weeklyCalories ingredients icon');
        if(user){
            return user;
        }
        else{
            return null;
        }
    }
    catch (err) {
        console.error('Error occurred:', err);
        return null;
    }
}

export const update = async (uid: string, userInfo: UserInfo) => {
    let res = -1;
    try{
        const user = await UserProfile.findById(uid);
        if(user){
            await UserProfile.findByIdAndUpdate(uid,userInfo);
            res = 1;
        }
        else{
            res = -1;
        }

    }catch (err) {
        console.error('Error occurred:', err);
        res = -2;
    }finally{
        return res;
    }
}

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('DB Connection closed by shutting down the server');
    process.exit(0);
});