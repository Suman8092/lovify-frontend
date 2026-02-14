// 🔥 LOAD ENV FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Debug check
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY exists:", !!process.env.SUPABASE_KEY);

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Utility: Slug Generator
function generateSlug(yourName, partnerName) {
  return (
    yourName.toLowerCase().replace(/\s+/g, "-") +
    "-for-" +
    partnerName.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

//////////////////////////////////////////////////////////////
// 📸 Upload Photo Route
//////////////////////////////////////////////////////////////
app.post("/api/upload", upload.single("photo"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = Date.now() + "-" + file.originalname;

    const { error } = await supabase.storage
      .from("surprise-images")   // 👈 bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log("❌ Upload Error:", error);
      return res.status(400).json({ error: error.message });
    }

    const publicUrl = supabase.storage
      .from("surprise-images")
      .getPublicUrl(fileName).data.publicUrl;

    res.json({ url: publicUrl });

  } catch (err) {
    console.log("❌ Upload Crash:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

//////////////////////////////////////////////////////////////
// ❤️ Create Surprise
//////////////////////////////////////////////////////////////
app.post("/api/create", async (req, res) => {
  try {
    console.log("🔥 Create API hit");
    console.log("Incoming Body:", req.body);

    const { your_name, partner_name, message, theme, photos } = req.body;

    if (!your_name || !partner_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = generateSlug(your_name, partner_name);

    const { data, error } = await supabase
      .from("surprises")
      .insert([
        {
          your_name,
          partner_name,
          message,
          theme,
          slug,
          photos: photos || [],
        },
      ])
      .select();

    if (error) {
      console.log("❌ Supabase Error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("✅ Inserted:", data);

    res.json({ slug });

  } catch (err) {
    console.log("❌ Server Crash:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//////////////////////////////////////////////////////////////
// 💌 Get Surprise by Slug
//////////////////////////////////////////////////////////////
app.get("/api/surprises/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("surprises")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.log("❌ Fetch Error:", error);
      return res.status(404).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//////////////////////////////////////////////////////////////
// 🚀 Start Server
//////////////////////////////////////////////////////////////
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000 💖");
});
