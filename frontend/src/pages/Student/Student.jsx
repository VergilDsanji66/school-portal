import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../../Firebase/firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import './Student.css';

const Student = () => {
    const location = useLocation();
    const { studentNo } = location.state || {};
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Fetch student data based on student number
    useEffect(() => {
        if (!studentNo) {
            setError('Student number not provided');
            setLoading(false);
            return;
        }

        setLoading(true);
        const studentsRef = ref(database, 'Students');
        const studentQuery = query(studentsRef, orderByChild('studentNo'), equalTo(studentNo));

        const unsubscribe = onValue(studentQuery, (snapshot) => {
            if (!snapshot.exists()) {
                setError('Student not found');
                setLoading(false);
                return;
            }

            const data = snapshot.val();
            const [studentId, studentInfo] = Object.entries(data)[0];
            setStudentData({ id: studentId, ...studentInfo });
            setLoading(false);
        }, (error) => {
            setError(error.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [studentNo]);

    if (loading) return <div className="loading">Loading student data...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!studentData) return <div className="error">Student data not available</div>;

    return (
        <div className="student-portal">
            <header className="student-header">
                <div className="profile-info">
                    <h1>{studentData.firstName} {studentData.lastName}</h1>
                    <p>Student Number: {studentData.studentNo}</p>
                    <p>Course: {studentData.course}</p>
                </div>
                <nav className="portal-nav">
                    <button 
                        className={activeTab === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button 
                        className={activeTab === 'courses' ? 'active' : ''}
                        onClick={() => setActiveTab('courses')}
                    >
                        My Courses
                    </button>
                    <button 
                        className={activeTab === 'grades' ? 'active' : ''}
                        onClick={() => setActiveTab('grades')}
                    >
                        Grades
                    </button>
                    <button 
                        className={activeTab === 'assignments' ? 'active' : ''}
                        onClick={() => setActiveTab('assignments')}
                    >
                        Assignments
                    </button>
                </nav>
            </header>

            <main className="portal-content">
                {activeTab === 'dashboard' && (
                    <div className="dashboard">
                        <div className="welcome-banner">
                            <h2>Welcome back, {studentData.firstName}!</h2>
                            <p>You have {studentData.modules?.length || 0} active courses this semester.</p>
                        </div>

                        <div className="upcoming-events">
                            <h3>Upcoming Deadlines</h3>
                            <div className="event-list">
                                {/* Sample events - would come from database in real app */}
                                <div className="event">
                                    <span className="event-date">Nov 15</span>
                                    <span className="event-title">COM1141 - Assignment 2 Due</span>
                                </div>
                                <div className="event">
                                    <span className="event-date">Nov 20</span>
                                    <span className="event-title">MATH101 - Midterm Exam</span>
                                </div>
                            </div>
                        </div>

                        <div className="quick-links">
                            <h3>Quick Links</h3>
                            <div className="links-grid">
                                <button>View Grades</button>
                                <button>Submit Assignment</button>
                                <button>Course Materials</button>
                                <button>Academic Calendar</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="courses-section">
                        <h2>My Courses</h2>
                        <div className="course-grid">
                            {studentData.modules?.map((module, index) => (
                                <div 
                                    key={index} 
                                    className={`course-card ${selectedCourse === module ? 'active' : ''}`}
                                    onClick={() => setSelectedCourse(selectedCourse === module ? null : module)}
                                >
                                    <h3>{module}</h3>
                                    <p>Course description would appear here</p>
                                    {selectedCourse === module && (
                                        <div className="course-details">
                                            <button>View Materials</button>
                                            <button>View Assignments</button>
                                            <button>Contact Lecturer</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'grades' && (
                    <div className="grades-section">
                        <h2>My Grades</h2>
                        <div className="grades-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Assignment</th>
                                        <th>Grade</th>
                                        <th>Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Sample grades - would come from database in real app */}
                                    <tr>
                                        <td>COM1141</td>
                                        <td>Assignment 1</td>
                                        <td>87%</td>
                                        <td>Excellent work!</td>
                                    </tr>
                                    <tr>
                                        <td>MATH101</td>
                                        <td>Midterm Exam</td>
                                        <td>66%</td>
                                        <td>Good effort, some calculation errors</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="assignments-section">
                        <h2>My Assignments</h2>
                        <div className="assignment-list">
                            {/* Sample assignments - would come from database in real app */}
                            <div className="assignment">
                                <div className="assignment-info">
                                    <h3>COM1141 - Assignment 2</h3>
                                    <p>Due: November 15, 2023</p>
                                    <p>Status: Submitted</p>
                                </div>
                                <div className="assignment-actions">
                                    <button>View Details</button>
                                    <button>Download</button>
                                </div>
                            </div>
                            <div className="assignment">
                                <div className="assignment-info">
                                    <h3>MATH101 - Problem Set 3</h3>
                                    <p>Due: November 20, 2023</p>
                                    <p>Status: Not Submitted</p>
                                </div>
                                <div className="assignment-actions">
                                    <button>Submit Work</button>
                                    <button>View Requirements</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Student;