const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")


const app = express()

//::
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const userStory = require("./routes/story")

//::
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    dotfiles: "deny",
    index: false
}))


app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Mongo Connected!");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});


//::
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/story", userStory)


app.listen(5000, ()=>{
    console.log("Server Running!")
})