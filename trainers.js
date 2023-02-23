const mongoose = require("mongoose");
const Trainer = require("./models/trainer");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/powertest');
  console.log("Mongo Connection lobel open")
}

const trainers = [
  { firstName: "Roberto", lastName: "Duran", gender: "Hombre", age: 34, weight: 69, 
  height: 174, wingSpan: 183, redpointLead: "14a", redpointBoulder: "v12", 
  picture: "https://images.unsplash.com/photo-1578763397601-ad069af37f14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
  description: "Me gusta el ping pong"}
]

const insertTrainers = async() => {
await Trainer.deleteMany({});  
Trainer.insertMany(trainers)
.then(res=>{
  console.log(res)
})
.catch(err => {
  console.log(err)
})
} 
insertTrainers().then(()=>{
  mongoose.connection.close()
})