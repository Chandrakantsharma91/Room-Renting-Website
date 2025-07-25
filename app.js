if(process.env.NODE_ENV !== "production"){
   require("dotenv").config();
}

 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnb";
const dbUrl =process.env.ATLASDB_URL


main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodeOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret :process.env.SECRET,
    },
    // Session interval
    touchAfter: 24 * 60 * 60

});

store.on("error" , function(e){
    console.log("Error in mongo session store" , e);
});

const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,// 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    app.locals.currentUser = req.user;
    next();
}   );

app.get("/demouser" , async (req , res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });
     
    
   let registeredUser=  await User.register(fakeUser , "helloworld");
    res.send(registeredUser);
})


app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


// app.get("/testListing" , async (req , res)=>{
//     let sampleListing = new Listing({
//         title : "MY HOME",
//         description : "By the beach",
//         price: 12000,
//         location: "Mumbai",
//         country:"INDIA"
//     });

//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("sucessful testing")
     
// })

app.all("*" , (req , res , next) =>{
    next(new ExpressError(404 , "Page not found"))
})

// app.get("/" , (req , res)=>{
//     res.send("Hii I am root");
// })

app.use((err, req , res , next)=>{
    let {statusCode = 500  , message= "Something went wrong"}= err;
    res.render("error.ejs" , {message})
    // res.status(statusCode).send(message);
    
})

app.listen(8080 , () =>{
    console.log("server is listen at port 8080");
    
})