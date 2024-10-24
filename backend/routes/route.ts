import * as dbfunlib from "../db/functions";
import {Router} from "express";

const router = Router();

// router.get("/", async (req,res) => {
//     const spots = await dbspot.getAll();
//     res.json(spots);
// });

// router.get("/:id", async (req,res) => {
//     const {id} = req.params;
//     try{
//         const spot = await dbspot.get(Number(id));
//         res.status(201).json(spot);
//     }
//     catch{
//         res.status(400).send("cannot get the value");
//     }
// });

router.post("/resgiter", async (req,res) => {
    console.log("Posting request to create a user");
    const data = req.body;
    if(!data || !data.username || !data.email || !data.password){
        res.status(400).send("Bad Request: Some information is null, it requires username, email, and password");
        return;
    }

    const uid = await dbfunlib.create(data.username,data.email,data.password);
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

router.get("/login", async (req,res) => {
    console.log("Log in request");
    const data = req.body;
    if(!data || !data.username || !data.password){
        res.status(401).send("Bad Request: Some information is null, it requires username/email and password");
        return;
    }

    const code = await dbfunlib.login(data.username,data.password);
    if(code===1){
        return res.status(201).json({ message: "User loggin successfully."});
    }
    else if(code===-1){
        return res.status(400).json({ message: "The username/email or password is incorrect."});
    }
    else{
        return res.status(401).send("Bad Request");
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