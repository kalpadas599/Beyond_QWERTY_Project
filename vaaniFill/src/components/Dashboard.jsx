import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

const Dashboard = () => {
    const [forms, setForms] = useState([]);
    const [allForms, setAllForms] = useState([]);
    const [formCreators, setFormCreators] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setForms(response.data);
            } catch (err) {
                console.error("Error fetching forms:", err);
                setError("Failed to load forms. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchAllForms = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/all-forms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAllForms(response.data);
            } catch (err) {
                console.error("Error fetching all forms:", err);
                setError("Failed to load all forms. Please try again.");
            }
        };

        const fetchFormCreators = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/form-creators`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const creatorMap = {};
                response.data.forEach(user => {
                    creatorMap[user.id] = user.username;
                });

                setFormCreators(creatorMap);
            } catch (err) {
                console.error("Error fetching form creators:", err);
                setError("Failed to load form creators.");
            }
        };

        fetchForms();
        fetchAllForms();
        fetchFormCreators();
    }, []);

    const deleteForm = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not authenticated. Please log in.");
                return;
            }

            await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setForms(forms.filter(form => form.form_id !== id));
        } catch (err) {
            console.error("Error deleting form:", err);
            setError("Failed to delete form. Please try again.");
        }
    };

    if (loading) return <p className="text-center min-h-[83vh] text-white font-bold">Loading...</p>;
    if (error) return <p className="text-center text-red-500 font-bold">{error}</p>;

    const createNewForm = async () => {
        const newFormId = crypto.randomUUID();
        navigate(`/form/${newFormId}`);
    };

    return (
        <div className="container mx-auto p-4 min-h-[83vh]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white-700">Your Forms</h2>
                <button
                    onClick={createNewForm}
                    className="px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 flex items-center"
                >
                    <FaPlus className="mr-2" /> Create New Form
                </button>
            </div>
            {forms.length === 0 ? (
                <p className="text-white font-bold">No forms found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forms.map((form) => (
                        <div key={form.form_id} className="border border-gray-300 p-4 bg-transparent rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-white-700">{form.form_name}</h3>
                            <p className="text-white-500">Created: {new Date(form.created_at).toLocaleString()}</p>
                            <div className="mt-2 flex space-x-2">
                                <button
                                    onClick={() => navigate(`/fill-form/${form.form_id}`)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                                >
                                    Fill
                                </button>
                                <button 
                                    onClick={() => navigate(`/responses/${form.form_id}`)} 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                >
                                    Responses
                                </button>
                                <button 
                                    onClick={() => deleteForm(form.form_id)} 
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="text-2xl font-bold text-white-700 mt-8 mb-4">Other Forms</h2>
            {allForms.length === 0 ? (
                <p className="text-white font-bold">No forms found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allForms.map((form) => (
                        <div key={form.form_id} className="border border-gray-300 p-4 rounded-2xl shadow-lg bg-transparent hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-white-700">{form.form_name}</h3>
                            <p className="text-white-500">Created on: {new Date(form.created_at).toLocaleString()}</p>
                            <p className="text-white-500">
                                Created by: <span>{formCreators[form.username] || "Unknown"}</span>
                            </p>
                            <button
                                onClick={() => navigate(`/fill-form/${form.form_id}`)}
                                className="mt-2 cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Fill
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
