import { Routes, Route } from 'react-router'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import CourseOutcomes from './pages/CourseOutcomes'
import CoPoMapping from './pages/CoPoMapping'
import ProgramOutcomes from './pages/ProgramOutcomes'
import PsoManagement from './pages/PsoManagement'
import QuestionBank from './pages/QuestionBank'
import Assessments from './pages/Assessments'
import Students from './pages/Students'
import Attainment from './pages/Attainment'
import Surveys from './pages/Surveys'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course-outcomes" element={<CourseOutcomes />} />
        <Route path="/co-po-mapping" element={<CoPoMapping />} />
        <Route path="/program-outcomes" element={<ProgramOutcomes />} />
        <Route path="/pso-management" element={<PsoManagement />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/students" element={<Students />} />
        <Route path="/attainment" element={<Attainment />} />
        <Route path="/surveys" element={<Surveys />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
