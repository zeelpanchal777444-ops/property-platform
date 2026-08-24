const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google's DNS servers for lookups.
// This fixes "querySrv ECONNREFUSED" errors caused by the
// operating system / router / ISP not resolving MongoDB's SRV records.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
