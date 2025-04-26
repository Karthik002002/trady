import React, { useState } from "react";
import RandomAnimatedText from "./RandomText";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SpinnerCircularFixed } from "spinners-react";
import { APPURL } from "../../../URL";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ username: "", password: "" });
  const Navigate = useNavigate();
  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.username.length < 3 || data.password.length < 4) {
      return;
    }
    setIsLoading(true);
    fetch(APPURL.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 👈 required for JSON body
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          window.localStorage.removeItem("user");
          window.localStorage.setItem("user", JSON.stringify(response));
          Navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Error on login", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    // bg-gradient-to-b from-zinc-300 to-emerald-300
    <div className=" min-h-[100vh] flex justify-center items-center w-full bg-gradient-to-b from-zinc-200 to-green-300 ">
      <div className="bg-white min-h-[45vh] max-w-sm min-w-sm sm:min-w-lg rounded-lg shadow-2xl hover:scale-[1.005] transition-all duration-300 flex flex-col items-center py-3 px-3">
        <RandomAnimatedText text="Trady" />
        <h6 className="text-gray-400 michroma-regular mb-10">
          Welcome to the Journey
        </h6>
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Username */}
          <div className="flex flex-col justify-start w-full">
            <label className="text-gray-400 text-md font-medium mb-1">
              Enter Username:
            </label>
            <input
              type="text"
              placeholder="Username"
              value={data.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col justify-start w-full relative">
            <label className="text-gray-400 text-md font-medium mb-1">
              Enter Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={data.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-500"
            />
            <span
              className="absolute right-3 top-[60%] cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>
        </div>

        <button
          className={`w-[92%] h-[2.5em]  bg-gradient-to-br !border-none outline-none mt-4 from-green-200 to-green-600 rounded-lg mb-4 focus:ring-4 focus:ring-green-400 focus:outline-none focus:border-none text-center place-items-center ${
            isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
          }`}
          onClick={(e) => {
            handleSubmit(e);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <SpinnerCircularFixed
              size={20}
              color="white"
              speed={250}
              thickness={200}
            />
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}
