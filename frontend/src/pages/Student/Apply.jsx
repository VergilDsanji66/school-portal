import React, { useState } from 'react';
import { database } from '../../Firebase/firebase'; // Import your database instance
import { ref, push, set } from 'firebase/database';
import './Apply.css';

const Apply = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        course: '',
        modules: [],
        currentModule: ''
    });

    const courses = [
        'Computer Science',
        'Biology',
        'Literature',
        'Mathematics',
        'Engineering'
    ];

    const availableModules = {
        'Computer Science': ['COM1141', 'COM2141', 'COM2241', 'COM2120','COM3120'],
        'Biology': ['BIO101', 'BIO201', 'CHEM101', 'CHEM201'],
        'Literature': ['LIT101', 'LIT201', 'HIST101', 'PHIL101'],
        'Mathematics': ['MATH101', 'MATH201', 'MATH301', 'STAT101'],
        'Engineering': ['ENG101', 'ENG201', 'PHYS101', 'MATH301']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddModule = () => {
        if (formData.currentModule.trim() === '') return;
        
        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, prev.currentModule.toUpperCase()],
            currentModule: ''
        }));
    };

    const handleRemoveModule = (index) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.firstName || !formData.lastName || !formData.course) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Generate student number (year + 6 digits)
            const year = new Date().getFullYear().toString().slice(-2);
            const studentsRef = ref(database, 'Students'); // Changed to 'Students' to match your requirement
            const newStudentRef = push(studentsRef);
            
            await set(newStudentRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                studentNo: `${year}${String(Math.floor(100000 + Math.random() * 900000))}`,
                course: formData.course,
                modules: formData.modules,
                status: 'pending'
            });

            alert('Application submitted successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                course: '',
                modules: [],
                currentModule: ''
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Error submitting application. Please try again.');
        }
    };

    return (
        <div className="apply-container">
            <h1>Student Application Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name*</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name*</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Course*</label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a course</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>{course}</option>
                        ))}
                    </select>
                </div>

                {formData.course && (
                    <div className="modules-section">
                        <h3>Select Modules for {formData.course}</h3>
                        
                        <div className="add-module">
                            <select
                                name="currentModule"
                                value={formData.currentModule}
                                onChange={handleChange}
                            >
                                <option value="">Select a module</option>
                                {availableModules[formData.course]?.map((module, index) => (
                                    <option key={index} value={module}>{module}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={handleAddModule}
                                disabled={!formData.currentModule}
                            >
                                Add Module
                            </button>
                        </div>

                        <div className="selected-modules">
                            <h4>Selected Modules:</h4>
                            {formData.modules.length > 0 ? (
                                <ul>
                                    {formData.modules.map((module, index) => (
                                        <li key={index}>
                                            {module}
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveModule(index)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No modules selected yet</p>
                            )}
                        </div>
                    </div>
                )}

                <button type="submit" className="submit-btn">
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default Apply;