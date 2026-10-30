import { Routes, Route, Navigate } from "react-router-dom";

import PhonePage from "./pages/PhonePage";
import KitchenPage from "./pages/KitchenPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/phone" replace />} />

      <Route path="/phone" element={<PhonePage />} />

      <Route path="/kitchen" element={<KitchenPage />} />
    </Routes>
  );
}

export default App;