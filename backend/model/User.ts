import mongoose from "mongoose";
import { Schema, Document, Model } from "mongoose";

export interface UserCredential extends Document{
    googleId: string,
    username: string,
    email: string,
    password: string,
    allergies: string[],
    favFoods: number[],
    favDrinks: number[],
    weeklyCalories: number[],
    ingredients: string[],
    icon: Buffer
}

export interface UserInfo extends Document{
    username: string,
    email: string,
    allergies: string[],
    favFoods: number[],
    favDrinks: number[],
    weeklyCalories: number[],
    ingredients: string[],
    icon: Buffer
}

const UserCredentialSchema: Schema<UserCredential> = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    allergies: { type: [String]},
    favFoods: { type: [Number]},
    favDrinks: { type: [Number]},
    weeklyCalories: { type: [Number]},
    ingredients: { type: [String]},
    icon: {type: Buffer,required: true }
},{collection: 'crendentials'});

const UserInfoSchema: Schema<UserInfo> = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    allergies: { type: [String]},
    favFoods: { type: [Number]},
    favDrinks: { type: [Number]},
    weeklyCalories: { type: [Number]},
    ingredients: { type: [String]},
    icon: {type: Buffer,required: true }
},{collection: 'crendentials'});

export const User: Model<UserCredential> = mongoose.model<UserCredential>('User',UserCredentialSchema);
export const UserProfile: Model<UserInfo> = mongoose.model<UserInfo>('UserInfo', UserInfoSchema);