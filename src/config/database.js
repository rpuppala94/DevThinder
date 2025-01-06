const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://rpuppala:Pzlt90mhH4Ka37EJ@namastenode.la3cz.mongodb.net/devTinder"
  );
};
module.exports = connectDb;
