import assets from "../assets/assets"; // ✅ Make sure assets.logo exists
import { useNavigate } from "react-router-dom";
import logo from '../assets/favicon.svg';
export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">

        {/* 👉 Left section with Logo + Text */}
        <div className="md:max-w-96">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Mindmesh Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <h1 className="font-semibold text-2xl sm:text-2xl xl:text-3xl text-primary">
              Mindmesh<span className="text-gray-600">.ai</span>
            </h1>
          </div>
          <p className="mt-6 text-sm">
            Experience the power of AI with Mindmesh.ai. <br />
            Transform your content creation process with our AI-driven tools designed to enhance productivity and creativity.
          </p>
        </div>

        {/* 👉 Right section with Links + Newsletter */}
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#">Home</a></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 mb-5">Subscribe to our newsletter</h2>
            <div className="text-sm space-y-2">
              <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
              <div className="flex items-center gap-2 pt-4">
                <input
                  className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="bg-primary cursor-pointer w-24 h-9 text-white rounded">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 👉 Footer Bottom */}
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2024 © Mindmesh.ai. All Rights Reserved.
      </p>
    </footer>
  );
}
