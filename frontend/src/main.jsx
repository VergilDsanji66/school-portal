import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import Admin from './pages/Admin/Admin.jsx'
import Student from './pages/Student/Student.jsx'
import Lecture from './pages/Lecture/Lecture.jsx'
import Apply from './pages/Student/Apply.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App/> },
  { path: '/LoginPage', element: <LoginPage/> },
  { 
    path: '/Admin', 
    element: <Admin /> 
  },
  { 
    path: '/Student', 
    element: <Student />,
    loader: ({ request }) => {
      const url = new URL(request.url);
      return { studentNo: url.searchParams.get('studentNo') };
    }
  },
  { 
    path: '/Lecture', 
    element: <Lecture />,
    loader: ({ request }) => {
      const url = new URL(request.url);
      return { email: url.searchParams.get('email') };
    }
  },
  { path: '/Apply', element: <Apply/> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)