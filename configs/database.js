const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("connect db successfully!");
  } catch (error) {
    console.log("connect db failed!", error);
  }
};

const disconnect = async (cb) => {
  mongoose.connection.close(null, cb && cb());
};

module.exports = { connect, disconnect };
