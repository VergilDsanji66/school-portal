import React, { useState, useEffect } from 'react';
import { database } from '../../Firebase/firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import './AddHero.css';

const AddHero = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchStudent, setSearchStudent] = useState('');
    const [newCourse, setNewCourse] = useState({
        code: '',
        name: '',
        degree: ''
    });
    const [newLecturer, setNewLecturer] = useState({
        title: 'Mr.',
        firstName: '',
        lastName: '',
        email: '',
        modules: []
    });
    const [currentModule, setCurrentModule] = useState('');
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        studentNo: '',
        course: '',
        modules: []
    });

    // Fetch data from Firebase
    useEffect(() => {
        const coursesRef = ref(database, 'courses');
        const lecturersRef = ref(database, 'lecturers');
        const studentsRef = ref(database, 'students');

        onValue(coursesRef, (snapshot) => {
        const data = snapshot.val();
        setCourses(data ? Object.entries(data).map(([id, course]) => ({ id, ...course })) : []);
        });

        onValue(lecturersRef, (snapshot) => {
        const data = snapshot.val();
        setLecturers(data ? Object.entries(data).map(([id, lecturer]) => ({ id, ...lecturer })) : []);
        });

        onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        setStudents(data ? Object.entries(data).map(([id, student]) => ({ id, ...student })) : []);
        });
    }, []);

    // Course Functions
    const addCourse = () => {
        if (!newCourse.code || !newCourse.name || !newCourse.degree) {
        alert('Please fill all course fields');
        return;
        }
        const coursesRef = ref(database, 'courses');
        push(coursesRef, {
        code: newCourse.code.toUpperCase(),
        name: newCourse.name,
        degree: newCourse.degree
        });
        setNewCourse({ code: '', name: '', degree: '' });
    };

    const deleteCourse = (id) => {
        const courseRef = ref(database, `courses/${id}`);
        remove(courseRef);
    };

    // Lecturer Functions
    const addLecturer = () => {
        if (!newLecturer.firstName || !newLecturer.lastName || !newLecturer.email) {
        alert('Please fill all required lecturer fields');
        return;
        }
        const lecturersRef = ref(database, 'lecturers');
        push(lecturersRef, {
        title: newLecturer.title,
        firstName: newLecturer.firstName,
        lastName: newLecturer.lastName,
        email: newLecturer.email,
        modules: newLecturer.modules
        });
        setNewLecturer({
        title: 'Mr.',
        firstName: '',
        lastName: '',
        email: '',
        modules: []
        });
    };

    const addModuleToLecturer = () => {
        if (!currentModule) return;
        setNewLecturer(prev => ({
        ...prev,
        modules: [...prev.modules, currentModule.toUpperCase()]
        }));
        setCurrentModule('');
    };

    const removeModuleFromLecturer = (index) => {
        setNewLecturer(prev => ({
        ...prev,
        modules: prev.modules.filter((_, i) => i !== index)
        }));
    };

    // Student Functions
    const addStudent = () => {
        if (!newStudent.firstName || !newStudent.lastName || !newStudent.course) {
        alert('Please fill all required student fields');
        return;
        }
        
        // Generate student number (year + 6 digits)
        const year = new Date().getFullYear().toString().slice(-2);
        const studentCount = students.filter(s => s.studentNo.startsWith(year)).length + 1;
        const studentNo = `${year}${String(studentCount).padStart(6, '0')}`;
        
        const studentsRef = ref(database, 'students');
        push(studentsRef, {
        ...newStudent,
        studentNo,
        modules: newStudent.modules.map(m => m.toUpperCase())
        });
        setNewStudent({
        firstName: '',
        lastName: '',
        studentNo: '',
        course: '',
        modules: []
        });
    };

    const deleteStudent = (id) => {
        const studentRef = ref(database, `students/${id}`);
        remove(studentRef);
    };

    const updateStudent = (id, updatedData) => {
        const studentRef = ref(database, `students/${id}`);
        update(studentRef, updatedData);
  };

  return (
    <div className="admin-dashboard">
        <div className="options">
            <h1 
            className={activeTab === 'courses' ? 'active' : ''} 
            onClick={() => setActiveTab('courses')}
            >
            Update Course(s)
            </h1>
            <h1 
            className={activeTab === 'lecturers' ? 'active' : ''} 
            onClick={() => setActiveTab('lecturers')}
            >
            Assign Lecture
            </h1>
            <h1 
            className={activeTab === 'students' ? 'active' : ''} 
            onClick={() => setActiveTab('students')}
            >
            Manage Student(s)
            </h1>
        </div>

        {activeTab === 'courses' && (
            <div className="course-section">
            <h2>Add New Course</h2>
            <div className="form-group">
                <input
                type="text"
                placeholder="Course Code (e.g., COM1141)"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                />
                <input
                type="text"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                />
                <input
                type="text"
                placeholder="Degree Program"
                value={newCourse.degree}
                onChange={(e) => setNewCourse({...newCourse, degree: e.target.value})}
                />
                <button onClick={addCourse}>Add Course</button>
            </div>

            <h2>Existing Courses</h2>
            {courses.length > 0 ? (
                <div className="courses-list">
                {courses.map((course) => (
                    <div key={course.id} className="course-card">
                    <div>
                        <strong>{course.code}</strong>
                        <p>{course.name}</p>
                        <small>{course.degree}</small>
                    </div>
                    <button onClick={() => deleteCourse(course.id)}>Delete</button>
                    </div>
                ))}
                </div>
            ) : (
                <p className="no-data">No courses found. Add a course to get started.</p>
            )}
            </div>
        )}

        {activeTab === 'lecturers' && (
            <div className="lecture-section">
            <div className="Info">
                <h3>Basic Information</h3>
                <select 
                className='titles'
                value={newLecturer.title}
                onChange={(e) => setNewLecturer({...newLecturer, title: e.target.value})}
                >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
                <option value="Professor">Professor</option>
                </select>
                <input 
                type="text" 
                id="firstName" 
                placeholder='First Name' 
                value={newLecturer.firstName}
                onChange={(e) => setNewLecturer({...newLecturer, firstName: e.target.value})}
                />
                <input 
                type="text" 
                id="lastName" 
                placeholder='Last Name' 
                value={newLecturer.lastName}
                onChange={(e) => setNewLecturer({...newLecturer, lastName: e.target.value})}
                />
                <input 
                type="email" 
                id="email" 
                placeholder='Email' 
                value={newLecturer.email}
                onChange={(e) => setNewLecturer({...newLecturer, email: e.target.value})}
                />
            </div>
            
            <div className="assign">
                <h3>Assigned Modules</h3>
                <input 
                type="text" 
                placeholder="Module Code (e.g., COM1141)"
                value={currentModule}
                onChange={(e) => setCurrentModule(e.target.value)}
                /> 
                <button onClick={addModuleToLecturer}>Add</button>
            </div>
            
            <div className="modules">
                {newLecturer.modules.length > 0 ? (
                <div className="modules-list">
                    {newLecturer.modules.map((module, index) => (
                    <div key={index} className="module-tag">
                        {module}
                        <button onClick={() => removeModuleFromLecturer(index)}>×</button>
                    </div>
                    ))}
                </div>
                ) : (
                <p>No modules assigned yet</p>
                )}
            </div>
            
            <button className="save-btn" onClick={addLecturer}>Save Lecturer</button>
            
            <h3>Existing Lecturers</h3>
            {lecturers.length > 0 ? (
                <div className="lecturers-list">
                {lecturers.map((lecturer) => (
                    <div key={lecturer.id} className="lecturer-card">
                    <div>
                        <h4>{lecturer.title} {lecturer.firstName} {lecturer.lastName}</h4>
                        <p>{lecturer.email}</p>
                        <div className="lecturer-modules">
                        {lecturer.modules?.map((module, i) => (
                            <span key={i} className="module-tag">{module}</span>
                        ))}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="no-data">No lecturers found.</p>
            )}
            </div>
        )}

        {activeTab === 'students' && (
            <div className="student-section">
            <div className="search-bar">
                <input
                type="text"
                placeholder="Search by student number"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                />
            </div>
            
            <h2>Add New Student</h2>
            <div className="form-group">
                <input
                type="text"
                placeholder="First Name"
                value={newStudent.firstName}
                onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                />
                <input
                type="text"
                placeholder="Last Name"
                value={newStudent.lastName}
                onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                />
                <input
                type="text"
                placeholder="Course"
                value={newStudent.course}
                onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                />
                <button onClick={addStudent}>Add Student</button>
            </div>
            
            <h2>Student List</h2>
            {students.length > 0 ? (
                <div className="students-list">
                {students
                    .filter(student => 
                    searchStudent === '' || 
                    student.studentNo.includes(searchStudent)
                    )
                    .map((student) => (
                    <div key={student.id} className="student-card">
                        <div className="student-header">
                        <span className="student-name">
                            {student.firstName} {student.lastName}
                        </span>
                        <span className="student-number">
                            {student.studentNo}
                        </span>
                        </div>
                        <div className="student-details">
                        <p>Course: {student.course}</p>
                        <div className="student-modules">
                            {student.modules?.map((module, i) => (
                            <span key={i} className="module-tag">{module}</span>
                            ))}
                        </div>
                        </div>
                        <div className="student-actions">
                        <button onClick={() => {
                            const newModule = prompt("Add module (e.g., COM1141):");
                            if (newModule) {
                            updateStudent(student.id, {
                                modules: [...student.modules, newModule.toUpperCase()]
                            });
                            }
                        }}>
                            Add Module
                        </button>
                        <button onClick={() => deleteStudent(student.id)}>
                            Delete
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            ) : (
                <p className="no-data">No students found.</p>
            )}
            </div>
        )}
        </div>
  );
};

export default AddHero;