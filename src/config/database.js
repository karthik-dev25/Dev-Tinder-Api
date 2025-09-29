const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://karthikn25dev:J94EoVikTfH67s5C@namastenodejs.qn1mkb8.mongodb.net/devTinder"
  );
};

module.exports =  connectDB ;
