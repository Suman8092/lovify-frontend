import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-500 via-rose-400 to-red-500">

      {/* Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative text-center text-white px-6">
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-xl">
          Create a Magical <br />
          <span className="text-yellow-200">Love Surprise 💖</span>
        </h1>

        <p className="text-xl mb-8 opacity-90 max-w-xl mx-auto">
          Turn your love story into a beautiful surprise website and
          send it to someone special.
        </p>

        <Link
          to="/create"
          className="inline-block bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:scale-105 transition duration-300"
        >
          Create Now 💘
        </Link>
      </div>
    </div>
  );
}
