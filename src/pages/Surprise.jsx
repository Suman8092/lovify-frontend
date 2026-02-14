import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Surprise() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/surprises/${slug}`)
      .then((res) => {
        setData(res.data);

        // dramatic delay before reveal
        setTimeout(() => {
          setShowContent(true);
        }, 1500);
      })
      .catch((err) => {
        console.error("Error loading surprise:", err);
      });
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white text-2xl animate-pulse">
        Preparing something magical... ✨
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-6 transition-all duration-1000 ${
        data.theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300 text-black"
      }`}
    >
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-bounce text-6xl opacity-10 absolute top-10 left-10">
          💖
        </div>
        <div className="animate-pulse text-5xl opacity-10 absolute bottom-20 right-20">
          💘
        </div>
        <div className="animate-bounce text-4xl opacity-10 absolute top-1/2 left-1/3">
          ❤️
        </div>
      </div>

      {showContent && (
        <div className="text-center backdrop-blur-xl bg-white/20 p-10 rounded-3xl shadow-2xl max-w-2xl animate-fadeIn">

          <h1 className="text-5xl font-bold mb-6 tracking-wide">
            {data.partner_name} ❤️ {data.your_name}
          </h1>

          <p className="text-xl leading-relaxed mb-8">
            {data.message}
          </p>

          {/* 📸 Photos Section */}
          {data.photos && data.photos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6">
              {data.photos.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="memory"
                  className="w-72 rounded-2xl shadow-2xl hover:scale-110 hover:rotate-2 transition duration-500"
                />
              ))}
            </div>
          )}

          <div className="mt-10 text-sm opacity-70">
            Made with 💖 specially for you
          </div>
        </div>
      )}
    </div>
  );
}
