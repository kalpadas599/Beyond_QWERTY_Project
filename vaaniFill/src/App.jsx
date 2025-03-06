import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FormEditor from "./components/FormEditor";
import FormFill from "./components/FormFill";
import FormResponses from "./components/FormResponses";
import Home from "./components/Home";

const App = () => {
    const [status, setStatus] = useState(false);

    useEffect(() => {
        setStatus(!!localStorage.getItem('token'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setStatus(false);
        window.location.href = '/';
    };

    return (
        <Router>
            <nav className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4 shadow-lg flex justify-between items-center text-white">
                <Link 
                    className="text-lg font-bold tracking-wide hover:text-yellow-300 transition transform hover:scale-105" 
                    to={status ? "/dashboard" : "/"}
                >
                    VaaniFill
                </Link>
                <ul className="flex space-x-6">
                    {!status ? (
                        <>
                            <li>
                                <Link className="hover:text-yellow-300 cursor-pointer transition transform hover:scale-105" to="/signup">
                                    Signup
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-yellow-300 cursor-pointer transition transform hover:scale-105" to="/login">
                                    Login
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button 
                                className="flex items-center gap-2 hover:text-yellow-300 transition cursor-pointer transform hover:scale-105" 
                                onClick={handleLogout}
                            >
                                <FiLogOut size={18} /> Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
            <main className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white min-h-[85vh] p-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setStatus={setStatus}/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/form/:id" element={<FormEditor />} />
                    <Route path="/fill-form/:id" element={<FormFill />} />
                    <Route path="/responses/:id" element={<FormResponses />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
