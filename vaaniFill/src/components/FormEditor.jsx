import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import axios from "axios";

const FormEditor = () => {
    const { id } = useParams();      
    const [formName, setFormName] = useState("");
    const [fields, setFields] = useState([]);
    const navigate = useNavigate();

    const addField = () => {
        setFields([...fields, { name: "", type: "text" }]);
    };

    const handleFieldChange = (index, key, value) => {
        setFields(fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)));
    };

    const deleteField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const isFormValid = () => {
        return formName.trim() !== "" && fields.length > 0 && fields.every(field => field.name.trim() !== "");
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not authenticated. Please log in.");
                return;
            }

            const formData = { id, formName, fields };
            await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/save-form`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Form saved successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving form:", error.response ? error.response.data : error);
            alert("Failed to save form. Check the console for details.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto min-h-[83vh] p-6 bg-transparent rounded-xl">
            <h2 className="text-3xl font-bold text-center text-gray-300 mb-10">Create Form</h2>
            <div className="shadow-2xl shadow-black p-6 rounded-lg">
            <input 
                type="text" 
                placeholder="Form Name" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-2"
            />
            {fields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2 p-2 rounded-lg bg-transparent">
                    <input 
                        type="text" 
                        placeholder="Field Name" 
                        value={field.name} 
                        onChange={(e) => handleFieldChange(index, "name", e.target.value)} 
                        className="flex-1 p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <select 
                        value={field.type} 
                        onChange={(e) => handleFieldChange(index, "type", e.target.value)} 
                        className="p-2 border cursor-pointer bg-transparent border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                        <option className="text-black" value="text">Text</option>
                        <option className="text-black" value="number">Number</option>
                        <option className="text-black" value="textarea">Textarea</option>
                        <option className="text-black" value="email">Email</option>
                        <option className="text-black" value="date">Date</option>
                        <option className="text-black" value="file">File Upload</option>
                        <option className="text-black" value="tel">Telephone</option>
                    </select>
                    <button onClick={() => deleteField(index)} className="bg-red-500 text-white cursor-pointer shadow-black shadow-md hover:shadow-2xl transition-all duration-300 py-2 px-4 rounded-lg ">Delete</button>
                </div>
            ))}
            <button onClick={addField} 
            className="bg-purple-600 cursor-pointer shadow-md shadow-black transition-all duration-300  hover:shadow-2xl text-white py-2 px-4 rounded-lg  mt-4 flex items-center space-x-2">
                <FiPlus className="text-xl" /> <span>Add Field</span>
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={!isFormValid()}
                className={`w-full py-3 rounded-lg transition mt-4 ${!isFormValid() ? 'bg-gray-500 opacity-80 cursor-not-allowed' : 'bg-green-600 cursor-pointer shadow-md shadow-black hover:shadow-2xl transition-all duration-300 text-white hover:bg-green'}`}
            >
                Save Form
            </button>
        </div>
        </div>
    );
};

export default FormEditor;
