import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import DashboardMembre from "./pages/DashboardMembre"
import DashboardCollecteur from "./pages/DashboardCollecteur"
import DashboardAdmin from "./pages/DashboardAdmin"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/membre" element={<DashboardMembre />} />
        <Route path="/collecteur" element={<DashboardCollecteur />} />
        <Route path="/admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
