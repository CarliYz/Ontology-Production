import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Shell from "./components/layout/Shell";
import OntologyList from "./pages/build-studio/OntologyList";
import StudioHome from "./pages/build-studio/StudioHome";
import AnalysisHome from "./pages/build-studio/AnalysisHome";
import ActionTypeBuilder from "./pages/build-studio/ActionTypeBuilder";
import InterfacesPage from "./pages/build-studio/InterfacesPage";
import GovernancePage from "./pages/build-studio/GovernancePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Navigate to="/build-studio" replace />} />
          <Route path="build-studio" element={<OntologyList />} />
          <Route path="build-studio/:ontologyId/*" element={<StudioHome />} />
          
          <Route path="analysis/*" element={<AnalysisHome />} />
          <Route path="actions" element={<ActionTypeBuilder />} />
          <Route path="interfaces" element={<InterfacesPage />} />
          <Route path="governance" element={<GovernancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
