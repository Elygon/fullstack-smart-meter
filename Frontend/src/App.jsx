import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import AddMeter from './pages/addMeter'
import Readings from './pages/readings'
import Notifications from './pages/notifications'
import NotificationDetails from './pages/notificationDetails'
import MeterList from './pages/meterList'
import NotFound from './pages/notFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/addMeter" element={<AddMeter />} />
        <Route path="/meterList" element={<MeterList />} />
        <Route path="/readings" element={<Readings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notificationDetails" element={<NotificationDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App