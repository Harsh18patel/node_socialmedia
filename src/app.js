import express from "express";
import cors from "cors";
import userRouter from "./router/user"
import postRouter from "./router/post"
import likeRouter from "./router/like"
import followersRouter from "./router/follower"
import savepostRouter from "./router/savepost"
import messageRouter from "./router/message"
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import session from "express-session";




const GOOGLE_CLIENT_ID = "510824756937-qqcnev3u1imh8udgik6p9e0mtt67qn0a.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"


// const facebook_CLIENT_ID = "466009502443050"
// const facebook_CLIENT_SECRET = "cc0a1c8a9eee1c73ff504186ee8ce25e"

// ----- google login------


var GoogleStrategy = require('passport-google-oauth20').Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://6532-2405-201-200b-6070-5dfc-476e-aa90-c1df.ngrok-free.app/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) 
{
    console.log("🚀 ~ profile:", profile)
    console.log("🚀 ~ refreshToken:", refreshToken)
    console.log("🚀 ~ accessToken:", accessToken)
    return cb(null, profile);
}
));

// ---facebook login----

// passport.use(new FacebookStrategy({
//     clientID: facebook_CLIENT_ID,
//     clientSecret: facebook_CLIENT_SECRET,
//     callbackURL: "https://6532-2405-201-200b-6070-5dfc-476e-aa90-c1df.ngrok-free.app/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) 
//   {
//       console.log("🚀 ~ facebook profile:", profile)
//       console.log("🚀 ~ facebook refreshToken:", refreshToken)
//       console.log("🚀 ~ facebook accessToken:", accessToken)
//       return cb(err, user);
//   }
// ));


passport.serializeUser((user,done)=>{
    done(null, user.id);
})

passport.deserializeUser((id,done)=>{
    done(err,user);
})

const app = express();

app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
}));

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/user",userRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/followers", followersRouter);
app.use("/savepost", savepostRouter);
app.use("/message", messageRouter);

app.get("/auth/google/callback",passport.authenticate("google",{failureRedirect: "/auth/failed"}),(req,res)=>{
    console.log("---test-->");
    res.send("welcome to goa singham")
})

app.get("/auth/google",passport.authenticate("google",{ scope: ['profile', 'email']}), (req,res)=>{
    res.redirect("/auth/google/callback")
})

app.get("/auth/failed",passport.authenticate("google",{ scope: ['profile']}), (req,res)=>{
    res.send("Login failed")
})


// === facebook===


// app.get("/auth/facebook/callback",passport.authenticate("facebook",{failureRedirect: "/auth/failed"}),(req,res)=>{
//     console.log("---test-->");
//     res.send("welcome to facebook")
// })

// app.get("/auth/facebook",passport.authenticate("facebook",{ scope: ['profile', 'email']}), (req,res)=>{
//     res.redirect("/auth/facebook/callback")
// })

// app.get("/auth/failed",passport.authenticate("facebook",{ scope: ['profile']}), (req,res)=>{
//     res.send("Login failed")
// })




app.get("/",(req,res)=>{
    console.log("--server runnig--",req);
    res.send("server runnig ");
})  

// app.use(express.static(path.join(__dirname,"..","\\")))

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get("/msg", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "index.html"));
});


export default app;
