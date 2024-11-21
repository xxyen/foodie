import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/route"
import cors from "cors";
import passport from "passport";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import "./services/passport";
import "dotenv/config";

const app = express();
const port = 4000;

// export const APP_SCHEMA = "Foodie://" // For Production
export const APP_SCHEMA = "exp://127.0.0.1:8081/--/"

app.use(cors());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // currently false in development
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  // (req, res) => {
  //   res.redirect("/");
  // }

  (req, res) => {
    if (req.user) {
      const userId = (req.user as any)._id;
      res.redirect(`${APP_SCHEMA}welcome?userId=${userId}`);
    }
  }
  
);

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    res.redirect(`${APP_SCHEMA}(tabs)/profile`);
    });
  });
});

// OAuth test
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

app.use("/users/",userRouter);

app.listen(port, () => {  
    console.log(`Foodie backend is listening on port ${port}`);
});