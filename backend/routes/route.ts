import * as mgsfunlib from "../db/mgslib";
import {Router} from "express";

const router = Router();

router.post("/register", async (req,res) => {
    console.log("Posting request to create a user");
    const data = req.body;
    if(!data || !data.username || !data.email || !data.password){
        res.status(400).send("Bad Request: Some information is null, it requires username, email, and password");
        return;
    }

    const uid = await mgsfunlib.create(data.username,data.email,data.password);
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

router.get("/:userId", async (req,res) => {
    console.log("Get Profile request");
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

// router.delete("/:id", async (req,res) => {
//     const {id} = req.params;
//     console.log(`DELETE /favorites${id}`);

//     const spot = await dbspot.remove(Number(id));
//     const status = spot ? {status: "success"} : {status:"error"};
//     res.json(status);
// });

export default router;