import * as mgsfunlib from "../db/mgslib";
import {Router} from "express";
import nodemailer from "nodemailer";


const router = Router();
// const multer = require('multer');
// const upload = multer({
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

router.post("/register", async (req,res) => {
    console.log("Posting request to create a user");
    const data = req.body;
    if(!data || !data.username || !data.email || !data.password){
        res.status(400).send("Bad Request: Some information is null, it requires username, email, and password");
        return;
    }

    const uid = await mgsfunlib.create(data.username,data.email,data.password,data.allergies,data.diets);
    if(uid!==-1 && uid!==-2){
        return res.status(201).json({ message: "User created successfully", userId: uid });
    }
    else if(uid===-2){
        return res.status(400).json({ message: "The username or email already exists."});
    }
    else{
        return res.status(401).send("Bad Request");
    }

});

router.post("/login", async (req,res) => {
    console.log("Log in request");
    const data = req.body;
    if(!data || !data.username || !data.password){
        res.status(401).json({message:"Bad Request: Some information is null, it requires username/email and password"});
        return;
    }
    const code = await mgsfunlib.login(data.username,data.password);
    if(code==='-2'){
        return res.status(401).send("Bad Request");
    }
    else if(code==='-1'){
        return res.status(400).json({ message: "The username/email or password is incorrect."});
    }
    else{
        return res.status(200).json({ id: code, message: "User loggin successfully."});
    }

});

router.post("/validate", async (req,res) => {
    console.log("validation email request");
    const data = req.body;
    if(!data || !data.email){
        res.status(401).json({message:"Bad Request: Some information is null, it requires username/email and password"});
        return;
    }
    const code = await mgsfunlib.getEmail(data.email);
    if(code===-2){
        return res.status(401).send("Bad Request");
    }
    else if(code===-1){
        return res.status(400).json({ message: "The Email Account does not exist."});
    }
    else{
        return res.status(201).json({ message: "Exist Account"});
    }

});

router.post("/sendEmail", async (req,res) => {
    //Ref: https://medium.com/@chiboy96/sending-emails-with-nodemailer-using-gmail-typescript-node-js-and-express-js-e2385e14177f
    console.log("send email request");
    const data = req.body;
    if(!data || !data.email || !data.content){
        res.status(401).json({message:"Bad Request: Some information is null, it requires username/email and password"});
        return;
    }
    

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'foodievalidation@gmail.com',
            pass: 'kzkqtxzvbllzchay',
        },
    });

    const mailOptions = {
        from: {
            name: 'Foodie',
            address: 'foodievalidation@gmail.com'
        },
        to: data.email,               
        subject: data.subject, 
        text: data.content, 
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return res.status(201).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(400).json({ message: "Error sending email: "+error});
    }

});


router.get("/:userId", async (req,res) => {
    const {userId} = req.params;

    const user = await mgsfunlib.get(userId);
    if(user){
        return res.status(200).json({ user, message: "User profile is retrieved successfully. "});
    }
    else{
        return res.status(404).json({ message: "The user with the specified userId does not exist."});
    }

});

router.put("/:userId", async (req,res) => {
    const {userId} = req.params;
    const data = req.body;

    const code = await mgsfunlib.update(userId, data);
    if(code===1){
        return res.status(200).json({ message: "User profile is updated successfully. "});
    }
    else if(code===-1){
        return res.status(404).json({ message: "The user with the specified userId does not exist."});
    }
    else{
        return res.status(400).json({ message: "Bad Request: Wrong userId format or Connection failure"});
    }

});

router.put("/:email/newPassword", async (req,res) => {
    const {email} = req.params;
    const data = req.body;
    console.log(data);
    const code = await mgsfunlib.updateByEmail(email, data);
    if(code===1){
        return res.status(200).json({ message: "Password is updated successfully. "});
    }
    else if(code===-1){
        return res.status(404).json({ message: "The user with the email does not exist."});
    }
    else{
        return res.status(400).json({ message: "Bad Request: Wrong userId format or Connection failure"});
    }

});

// router.delete("/:id", async (req,res) => {
//     const {id} = req.params;
//     console.log(`DELETE /favorites${id}`);

//     const spot = await dbspot.remove(Number(id));
//     const status = spot ? {status: "success"} : {status:"error"};
//     res.json(status);
// });

export default router;