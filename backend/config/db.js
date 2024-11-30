require("dotenv").config();

export const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/qairline";
