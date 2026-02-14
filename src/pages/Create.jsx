import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    your_name: "",
    partner_name: "",
    message: "",
    theme: "pink",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;

      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload",
          formData
        );

        photoUrl = uploadRes.data.url;
      }

      const res = await axios.post(
        "http://localhost:5000/api/create",
        {
          ...form,
          photos: photoUrl ? [photoUrl] : [],
        }
      );

      navigate(`/s/${res.data.slug}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong 💔");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 flex items-center justify-center p-6">
      
      <div className="backdrop-blur-xl bg-white/70 shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/40">

        <h2 className="text-3xl font-bold text-center mb-6 text-rose-600">
          Create Your Love Surprise 💖
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="your_name"
            placeholder="Your Name"
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="partner_name"
            placeholder="Partner Name"
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Write something romantic..."
            className="w-full p-3 rounded-xl border h-28 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            onChange={handleChange}
          />

          {/* 📸 Upload Section */}
          <div className="border-2 border-dashed border-rose-300 rounded-xl p-4 text-center hover:bg-rose-50 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="photoUpload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="photoUpload"
              className="cursor-pointer text-rose-600 font-medium"
            >
              Click to Upload Photo 📸
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 rounded-xl shadow-md max-h-40 mx-auto"
              />
            )}
          </div>

          <select
            name="theme"
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            onChange={handleChange}
          >
            <option value="pink">🌸 Pink Theme</option>
            <option value="dark">🌙 Dark Romantic</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            {loading ? "Creating Magic..." : "Create Surprise 💘"}
          </button>

        </form>
      </div>
    </div>
  );
}
