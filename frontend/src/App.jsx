import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Inscription from "./pages/Inscription"
import DashboardMembre from "./pages/DashboardMembre"
import DashboardCollecteur from "./pages/DashboardCollecteur"
import DashboardAdmin from "./pages/DashboardAdmin"
import DemandeRetrait from "./pages/DemandeRetrait"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/membre" element={<DashboardMembre />} />
        <Route path="/membre/retrait" element={<DemandeRetrait />} />
        <Route path="/collecteur" element={<DashboardCollecteur />} />
        <Route path="/admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App