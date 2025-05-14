import React, { useState } from 'react';
import './Admin.css';
import Navbar from '../../components/Navbar/Navbar';
import AddHero from '../../components/AddHero/AddHero';

const Admin = () => {
  // Placeholder data
  const semesterData = [
    { name: 'Semester 1', value: 72 },
    { name: 'Semester 2', value: 65 }
  ];

  const events = [
    { date: '2023-10-15', title: 'Math Midterm', type: 'exam' },
    { date: '2023-11-02', title: 'Science Fair', type: 'event' },
    { date: '2023-11-20', title: 'Parent-Teacher Meeting', type: 'meeting' },
    { date: '2023-12-10', title: 'Final Exams Begin', type: 'exam' }
  ];

  const [classes, setClasses] = useState([
    { name: 'Biology', students: 42, active: true },
    { name: 'Real Analysis', students: 28, active: false },
    { name: 'Computer Science', students: 56, active: true },
    { name: 'Literature', students: 35, active: false }
  ]);

  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      studentNo: '23000001', 
      modules: ['COM1141', 'MATH101'], 
      course: 'Computer Science' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      studentNo: '23000002', 
      modules: ['BIO101', 'CHEM201'], 
      course: 'Biology' 
    },
    { 
      id: 3, 
      name: 'Alex Johnson', 
      studentNo: '23000003', 
      modules: ['LIT301', 'HIST101'], 
      course: 'Literature' 
    }
  ]);

  const [newModule, setNewModule] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentModuleInput, setCurrentModuleInput] = useState('');

  const handleAddModule = (studentId) => {
    if (!currentModuleInput.trim()) return;
    
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          modules: [...student.modules, currentModuleInput.toUpperCase()]
        };
      }
      return student;
    }));
    
    setCurrentModuleInput('');
  };

  const handleRemoveModule = (studentId, moduleIndex) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          modules: student.modules.filter((_, index) => index !== moduleIndex)
        };
      }
      return student;
    }));
  };

  const handleAddNewModule = () => {
    if (!selectedStudent || !newModule.trim()) return;
    
    setStudents(students.map(student => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          modules: [...student.modules, newModule.toUpperCase()]
        };
      }
      return student;
    }));
    
    setNewModule('');
  };

  return (
    <div className="admin-page">
      <Navbar id={0} />
      <div className="admin-container">
        <div className="grid">
          <h2>Overall Student Marks (%)</h2>
          <div className="marks-chart">
            {semesterData.map((semester, index) => (
              <div key={index} className="semester-bar">
                <div className="bar-label">{semester.name}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${semester.value}%` }}
                  ></div>
                  <span className="bar-value">{semester.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid">
          <h2>Event Calendar</h2>
          <div className="calendar">
            {events.map((event, index) => (
              <div key={index} className={`event ${event.type}`}>
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="event-title">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid">
          <h2>Manage Classes</h2>
          <div className="classes-list">
            {classes.map((cls, index) => (
              <div key={index} className={`class-item ${cls.active ? 'active' : ''}`}>
                <div className="class-info">
                  <span className="class-name">{cls.name}</span>
                  <span className="student-count">{cls.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid main-content">
          <AddHero />
        </div>
      </div>
    </div>
  );
};

export default Admin;