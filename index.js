import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/myYeoboDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB Connected")
})

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req,res) => {
    const {email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            if(password === user.password) {
                res.send({message: "Login Successful", user: user})
            } else {
                res.send( {message: "Username or Password Incorrect!"})
            }
        } else {
            res.send({message: "User not Found"})
        }
    })
})

app.post("/register", (req,res) => {
    const { firstName, lastName, username, email, password } = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                firstName,
                lastName,
                username,
                email,
                password
            })
            user.save( err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( {message: "Successfully Registered"})
                    console.log(user)
                }
            })
        }
    })

})

// app.listen(9002,() => {
//     console.log("Server started at port 9002")
// })
app.listen(process.env.PORT || 9002, function() {
    console.log("Server is running at port 9002");
  })