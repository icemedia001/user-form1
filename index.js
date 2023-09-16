const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  fullName: String,
  section: String,
  agreeToTerms: Boolean,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("home");
});

// Corrected route definition for form submission
app.post("/submit-form", async (req, res) => {
  try {
    const { fullName, section, agreeToTerms } = req.body;
    
    if (!agreeToTerms) {
      return res.status(400).json({
        error: "You must agree to terms and conditions."
      });
    }

    // Create a new User document and save it to the database
    const user = new User({
      fullName,
      section,
      agreeToTerms,
    });

    await user.save();

    res.status(200).json({
      message: "Form submitted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
