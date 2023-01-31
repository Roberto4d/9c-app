const mongoose = require("mongoose");
const User = require("./models/user");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/powertest');
  console.log("Mongo Connection lobel open")
}

const athletes = [
  { firstName: "Roberto", gender: "Hombre", lastName: "Duran", age: 34, weight: 69, 
  height: 174, wingSpan: 183, redpointLead: "14a", redpointBoulder: "v12"},
  { firstName: "Jenn", gender: "Mujer", lastName: "Leong", age: 30, weight: 62, 
  height: 164, wingSpan: 164, redpointLead: "11c", redpointBoulder: "v4"},
  { firstName: "Gerardo", gender: "Hombre", lastName: "Workel", age: 29, weight: 70, 
  height: 179, wingSpan: 179, redpointLead: "13b", redpointBoulder: "v5"},
]

const insertAtlhetes = async() => {
await User.deleteMany({});  
User.insertMany(athletes)
.then(res=>{
  console.log(res)
})
.catch(err => {
  console.log(err)
})
} 
insertAtlhetes().then(()=>{
  mongoose.connection.close()
})