const express = require("express");
const { connection } = require("./db");
const { userRoutes } = require("./routes/userRoutes");
const { notesRoutes } = require("./routes/notesRoutes");
const jwt = require("jsonwebtoken");
const { NotesModel } = require("./models/notesModel");
const {Usermodel}=require("./models/userModel")
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json());
app.use("/users", userRoutes);
app.use("/notes", notesRoutes);


app.get("/refreash",(req,res)=>{
  const rtoken=req.headers.authorization

  const decoded=jwt.verify(rtoken,"notes")

  try {
    if(decoded){
      const token=jwt.sign({userID:decoded.userID,user:decoded.user}, "app",{expiresIn:300});
      res.send({"msg":"refreshtoken ",token:token})

    }
  } catch (error) {
    
  }
})
app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB connected");
    console.log("Server is running  port 8080");
  } catch (error) {
    console.log(error);
  }
});


