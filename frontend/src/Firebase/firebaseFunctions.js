import { ref, set, push, remove, update, onValue } from 'firebase/database';
import { database } from './firebase';


// Courses
export const addCourse = (courseData) => {
  const coursesRef = ref(database, 'courses');
  return push(coursesRef, {
    code: courseData.code.toUpperCase(),
    name: courseData.name,
    degree: courseData.degree
  });
};

export const deleteCourse = (courseId) => {
  const courseRef = ref(database, `courses/${courseId}`);
  return remove(courseRef);
};

// Lecturers
export const addLecturer = (lecturerData) => {
  const lecturersRef = ref(database, 'lecturers');
  return push(lecturersRef, {
    title: lecturerData.title,
    firstName: lecturerData.firstName,
    lastName: lecturerData.lastName,
    email: lecturerData.email,
    modules: lecturerData.modules.map(m => m.toUpperCase())
  });
};

export const updateLecturerModules = (lecturerId, modules) => {
  const lecturerRef = ref(database, `lecturers/${lecturerId}/modules`);
  return set(lecturerRef, modules.map(m => m.toUpperCase()));
};

// Students
export const addStudent = (studentData) => {
  const studentsRef = ref(database, 'students');
  return push(studentsRef, {
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    studentNo: studentData.studentNo,
    course: studentData.course,
    modules: studentData.modules.map(m => m.toUpperCase())
  });
};

export const updateStudent = (studentId, updatedData) => {
  const studentRef = ref(database, `students/${studentId}`);
  return update(studentRef, {
    ...updatedData,
    modules: updatedData.modules?.map(m => m.toUpperCase())
  });
};

export const deleteStudent = (studentId) => {
  const studentRef = ref(database, `students/${studentId}`);
  return remove(studentRef);
};

// Real-time data listeners
export const setupCoursesListener = (callback) => {
  const coursesRef = ref(database, 'courses');
  return onValue(coursesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.entries(data).map(([id, course]) => ({ id, ...course })) : []);
  });
};

export const setupLecturersListener = (callback) => {
  const lecturersRef = ref(database, 'lecturers');
  return onValue(lecturersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.entries(data).map(([id, lecturer]) => ({ id, ...lecturer })) : []);
  });
};

export const setupStudentsListener = (callback) => {
  const studentsRef = ref(database, 'students');
  return onValue(studentsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.entries(data).map(([id, student]) => ({ id, ...student })) : []);
  });
};