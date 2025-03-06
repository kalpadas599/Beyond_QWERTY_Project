import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMicrophone, FaRobot } from "react-icons/fa";
import { startRecording, stopRecording } from "../utils/speechToText";

const FormFill = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [errors, setErrors] = useState({});
    const [listening, setListening] = useState({});
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/fill-form/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setForm(response.data);
                const initialResponses = response.data.fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
                const initialListening = response.data.fields.reduce((acc, field) => ({ ...acc, [field.name]: false }), {});
                setResponses(initialResponses);
                setListening(initialListening);
            } catch (err) {
                console.error("Error fetching form:", err);
            }
        };

        fetchForm();

    }, [id]);

    const autoCorrectValue = (value, type) => {
        value = value.trim(); // Remove unnecessary spaces
    
        if (type === "email") {
            value = value.replace(/\s+/g, ""); // Remove spaces within email
            value = value.replace(/gmailcom$/i, "gmail.com"); // Fix "gmailcom" typo
    
            if (!value.includes("@")) {
                value += "@gmail.com";
            } else {
                let [local, domain] = value.split("@");
                if (!domain.includes(".")) {
                    domain = "gmail.com";
                }
                value = `${local}@${domain}`;
            }
        } else if (type === "number" || type === "tel") {
            value = value.replace(/[^0-9]/g, "");
        } else if (type === "date") {
            value = value.replace(/[^0-9]/g, "");
            if (value.length !== 8) return "Invalid Date";
            let day = value.substring(0, 2);
            let month = value.substring(2, 4);
            let year = value.substring(4, 8);
            return `${year}-${month}-${day}`;
        } else if (type === "text") {
            value = value.replace(/([a-z])([A-Z])/g, "$1 $2");
            value = value.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
            value = value.replace(/\b(Iam|mynameis|myself|from|in|at|of|to|with|and|but|so|because)\b/gi, " $1 ");
            value = value.replace(/\bIam\b/gi, "I am");
            value = value.replace(/\bMynameis\b/gi, "My name is");
            value = value.replace(/\bMyself\b/gi, "Myself,");
            value = value.replace(/,\s*/g, ", ");
            value = value.replace(/\.\s*/g, ". ");
            value = value.replace(/\s+/g, " ");
            value = value.charAt(0).toUpperCase() + value.slice(1);
            if (!/[.!?]$/.test(value)) {
                value += ".";
            }
        }
    
        return value;
    };
        


    const validateField = (value, type) => {
        let error = "";
        if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Invalid email address";
        } else if (type === "number" && isNaN(value)) {
            error = "Must be a number";
        } else if (type === "text" && value.trim() === "") {
            error = "This field is required";
        } else if (type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            error = "Invalid date format (YYYY-MM-DD)";
        } else if (type === "tel" && !/^\d{10}$/.test(value)) {
            error = "Invalid phone number (must be 10 digits)";
        }
        return error;
    };

    const handleChange = (fieldName, value, type) => {
        setResponses((prev) => ({ ...prev, [fieldName]: value }));
        setErrors((prev) => ({ ...prev, [fieldName]: validateField(value, type) }));
    };   

    const handleVoiceInput = async (fieldName, fieldType) => {
        if (!listening[fieldName]) {
            const recorder = await startRecording((text) => {
                const correctedValue = autoCorrectValue(text, fieldType);
                setResponses((prev) => ({ ...prev, [fieldName]: correctedValue }));                
            }, (isListening) => {
                setListening((prev) => ({ ...prev, [fieldName]: isListening }));
            }, fieldName);

            setMediaRecorder(recorder);
        } else {
            stopRecording(mediaRecorder);
            setListening((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async () => {
        const allFieldsValid = form.fields.every((field) => {
            const error = validateField(responses[field.name], field.type);
            if (error) setErrors((prev) => ({ ...prev, [field.name]: error }));
            return !error;
        });

        if (!allFieldsValid) {
            alert("Please fill out all fields correctly.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const formName = form.form_name;

            await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/submit`, {
                formName,
                responses,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Form submitted successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    
    const handleFillWithAI = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}/askgemini`,
                {
                    userInput: await responses.aiInput,
                    fields: form.fields,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            const aiResponses = response.data.extractedData;

            // Ensure aiResponses is an object before proceeding
        if (typeof aiResponses !== "object" || aiResponses === null) {
            console.error("Unexpected AI response format:", aiResponses);
            alert("Unexpected AI response format. Please try again.");
            return;
        }

        // Map AI response to the correct form fields, skipping missing fields
        setResponses((prev) => {
            const updatedResponses = { ...prev };
            form.fields.forEach((field) => {
                Object.keys(aiResponses).forEach((aiKey) => {
                    if (
                        field.name.toLowerCase().replace(/\s+/g, "") ===
                        aiKey.toLowerCase().replace(/\s+/g, "")
                    ) {
                        updatedResponses[field.name] = aiResponses[aiKey];
                    }
                });
            });
            return updatedResponses;
        });
    
        } catch (error) {
            console.error("Error with AI fill:", error);
            alert("Failed to fill form with AI.");
        }
    };    
    

    if (!form) return <p className="text-center min-h-[83vh] text-white font-bold">Loading form...</p>;

    return (
        <div className="flex items-center justify-center min-h-[83vh] bg-transparent p-4">
            <div className="max-w-2xl w-full bg-transparent p-6 shadow-2xl shadow-black rounded-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-6">{form.form_name}</h2>
                
                <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-transparent">
                    <div className="flex items-center space-x-2 mt-4">
                        <input
                            type="text"
                            value={responses.aiInput || ""}
                            placeholder="Say the following details required to fill the form"
                            onChange={(e) => handleChange("aiInput", e.target.value, "text")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("aiInput", "text")}
                            className={`p-3 rounded-full transition ${
                                listening["aiInput"] ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                        >
                            <FaMicrophone />
                        </button>
                    </div>
                    <button
                        onClick={handleFillWithAI}
                        className="flex items-center justify-center w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition mt-4"
                    >
                        <FaRobot className="mr-2" /> Fill with AI
                    </button>
                </div>

                {form.fields.map((field, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-lg font-medium text-white-700 mb-2">{field.name}:</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type={field.type}
                                value={responses[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => handleVoiceInput(field.name, field.type)}
                                className={`p-3 rounded-full cursor-pointer transition ${
                                    listening[field.name] ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <FaMicrophone />
                            </button>
                        </div>
                        {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                    </div>
                ))}

                <button 
                    onClick={handleSubmit} 
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default FormFill;
