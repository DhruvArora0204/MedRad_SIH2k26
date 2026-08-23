import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./db/db.js";


dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!!", err.message);
    process.exit(1); // Exit if the database connection fails
  });

server.on("error", (error) => {
  console.error("Server encountered an error:", error.message);
  process.exit(1);
});