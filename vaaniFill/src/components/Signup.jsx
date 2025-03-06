import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { startRecording, stopRecording } from "../utils/speechToText";
import { FaMicrophone, FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [listening, setListening] = useState({ username: false, email: false, password: false });
    const [recorders, setRecorders] = useState({ username: null, email: null, password: null });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

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
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/signup`, user);
            alert(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            alert(error.response.data.message || "Signup failed");
        }
    };

    return (
        <div className="flex items-center rounded-2xl justify-center min-h-[83vh] bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-gradient-to-br from-blue-400 via-purple-400">
                <h2 className="text-3xl font-bold text-center text-gray-900">Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={user.username}
                            name="username"
                            id="username"
                            placeholder="Username"
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("username")}
                            className="ml-4 cursor-pointer text-gray-600"
                        >
                            {listening.username ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
                        </button>
                    </div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative flex items-center">
                        <input
                            type="email"
                            value={user.email}
                            name="email"
                            id="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("email")}
                            className="ml-4 cursor-pointer text-gray-600"
                        >
                            {listening.email
                             ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
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
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute ml-81 text-gray-600"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("password")}
                            className="ml-4 cursor-pointer text-gray-600"
                        >
                            {listening.password
                             ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
                        </button>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="cursor-pointer w-full px-4 py-2 font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
