const app = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

console.log(
  "🔑 Environment check - API Key exists:",
  !!process.env.GOOGLE_GEMINI_KEY
);
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`);
  });
}
//Export server for vercel
export default server;