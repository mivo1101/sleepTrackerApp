const createApp = require("../src/app");
const { connectDb } = require("../src/helpers/db");
const { appConfig } = require("../src/helpers/settings");

console.log("Begin creating app");

const app = createApp();

console.log("Application creation complete");

// Default export for Vercel serverless function
module.exports = async (req, res) => {
    console.log("Begin connecting DB");
    await connectDb(appConfig.MONGODB_URI);
    console.log("Return app");
    return app(req, res);
};
