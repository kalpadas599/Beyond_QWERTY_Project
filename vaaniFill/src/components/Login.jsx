import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { startRecording, stopRecording } from "../utils/speechToText";
import { FaMicrophone, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setStatus }) => {
    const [user, setUser] = useState({ email: "", password: "" });
    const [listening, setListening] = useState({ email: false, password: false });
    const [recorders, setRecorders] = useState({ email: null, password: null });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (fieldName, value) => {
        setUser((prev) => ({ ...prev, [fieldName]: value }));
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, []);

    const autoCorrectValue = (value, type) => {
        value = value.trim(); // Remove unnecessary spaces

        if (type === "email") {
            // Ensure there is exactly one '@'
            if (!value.includes("@")) {
                value += "@gmail.com"; // Default to Gmail if no domain is provided
            } else {
                let [local, domain] = value.split("@");

                // If domain is missing or malformed, default to "gmail.com"
                if (!domain || !domain.includes(".")) {
                    domain = "gmail.com";
                } else {
                    // Auto-correct common mistakes like "gmailcom", "yahoocom", etc.
                    domain = domain.replace(/(gmail|yahoo|outlook|hotmail|icloud|aol|protonmail|zoho|yandex)com$/i, "$1.com");
                }

                value = `${local}@${domain}`;
            }
        }

        return value;
    };

    const handleVoiceInput = async (fieldName) => {
        if (!listening[fieldName]) {
            const recorder = await startRecording((text) => {
                const correctedValue = autoCorrectValue(text, fieldName);
                setUser((prev) => ({ ...prev, [fieldName]: correctedValue }));
            }, (isListening) => {
                setListening((prev) => ({ ...prev, [fieldName]: isListening }));
            }, fieldName);

            setRecorders(recorder);
        } else {
            stopRecording(recorders);
            setListening((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, user);
            localStorage.setItem("token", response.data.token);
            setStatus(true);
            alert("Login successful");
            navigate("/dashboard");
        } catch (error) {
            alert(error.response.data.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[83vh] rounded-2xl bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
            <div className="w-full max-w-lg p-8 space-y-6 rounded-lg shadow-2xl bg-gradient-to-br from-blue-400 via-purple-400">
                <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input with Voice */}
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative flex items-center">
                        <input
                            type="email"
                            value={user.email}
                            name="email"
                            id="email"
                            placeholder="Email"
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("email")}
                            className="ml-2 text-gray-800 cursor-pointer"
                        >
                            {listening.email ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
                        </button>
                    </div>

                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            name="password"
                            id="password"
                            placeholder="Password"
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("password")}
                            className="ml-2 text-gray-800 cursor-pointer"
                        >
                            {listening.password ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 absolute ml-98 text-gray-800"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div> 

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="cursor-pointer w-full py-3 text-white  bg-gradient-to-br from-purple-400 via-blue-400 font-bold rounded-lg shadow-md shadow-black transition-all duration-300 hover:shadow-2xl"
                            >   
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
