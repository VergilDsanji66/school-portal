import React, { useState, useEffect } from 'react';
import { database } from '../../Firebase/firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { useLocation } from 'react-router-dom';
import './Lecture.css';
import Navbar from '../../components/Navbar/Navbar';

const Lecture = () => {
  const [lecturer, setLecturer] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [newAssignment, setNewAssignment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentMarks, setStudentMarks] = useState({});

  const location = useLocation();
  const { email } = location.state || {};

  // Fetch lecturer data based on email
  useEffect(() => {
    if (!email) {
      setError('No email provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const lecturersRef = ref(database, 'lecturers');
      const lecturerQuery = query(lecturersRef, orderByChild('email'), equalTo(email));
      
      const unsubscribe = onValue(lecturerQuery, (snapshot) => {
        if (!snapshot.exists()) {
          setError('Lecturer not found');
          setLoading(false);
          return;
        }

        const data = snapshot.val();
        const [lecturerId, lecturerData] = Object.entries(data)[0];
        setLecturer({ id: lecturerId, ...lecturerData });
        setLoading(false);
        
        // Fetch students for lecturer's modules
        if (lecturerData.modules) {
          fetchStudents(lecturerData.modules);
        }
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [email]);

  // Fetch students who share modules with lecturer
  const fetchStudents = (lecturerModules) => {
    const studentsRef = ref(database, 'Students');
    
    onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const allStudents = snapshot.val();
        const filteredStudents = Object.entries(allStudents)
          .filter(([_, student]) => {
            if (!student.modules) return false;
            // Check if student has at least one module that matches lecturer's modules
            return student.modules.some(module => lecturerModules.includes(module));
          })
          .map(([id, student]) => ({ id, ...student }));
        
        setStudents(filteredStudents);
      }
    });
  };

  // Group students by module
  const studentsByModule = lecturer?.modules?.reduce((acc, module) => {
    acc[module] = students.filter(student => 
      student.modules?.includes(module));
    return acc;
  }, {});

  const handleAddAssignment = () => {
    if (!newAssignment.trim() || !activeModule) return;
    alert(`Assignment "${newAssignment}" added to ${activeModule}`);
    setNewAssignment('');
  };

  const handleMarkChange = (studentId, mark) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: mark
    }));
  };

  const handleSaveMark = (studentId) => {
    // Here you would typically save to database
    alert(`Mark ${studentMarks[studentId]} saved for student ${studentId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!lecturer) return <div className="error">Lecturer data not available</div>;

  return (
    <div className="lecture-dashboard">
      <Navbar id={2}/>
      {lecturer ? (
        <>
          <div className="lecturer-header">
            <h1>{lecturer.title} {lecturer.firstName} {lecturer.lastName}</h1>
            <p>Email: {lecturer.email}</p>
          </div>

          <div className="modules-grid">
            {lecturer.modules?.map((module) => (
              <div 
                key={module} 
                className={`module-card ${activeModule === module ? 'active' : ''}`}
                onClick={() => setActiveModule(activeModule === module ? null : module)}
              >
                <h3>{module}</h3>
                <span className="student-count">
                  {studentsByModule?.[module]?.length || 0} Students
                </span>
              </div>
            ))}
          </div>

          {activeModule && (
            <div className="module-details">
              <div className="upload-section">
                <h3>Upload Materials for {activeModule}</h3>
                <div className="upload-area">
                  <input
                    type="text"
                    placeholder="Assignment title"
                    value={newAssignment}
                    onChange={(e) => setNewAssignment(e.target.value)}
                  />
                  <button onClick={handleAddAssignment}>Add Assignment</button>
                  <div className="file-upload-placeholder">
                    <p>Drag and drop files here or click to browse</p>
                  </div>
                </div>
              </div>

              <div className="students-section">
                <h3>Students in {activeModule}</h3>
                <div className="students-list">
                  {studentsByModule?.[activeModule]?.map(student => (
                    <div key={student.id} className="student-card">
                      <div className="student-info">
                        <span className="student-name">{student.firstName} {student.lastName}</span>
                        <span className="student-id">{student.studentNo}</span>
                      </div>
                      <div className="student-actions">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter marks"
                          value={studentMarks[student.id] || ''}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        />
                        <button onClick={() => handleSaveMark(student.id)}>Save Mark</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading lecturer data...</p>
      )}
    </div>
  );
};

export default Lecture;