import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TestListPage from "@/pages/TestListPage";
import TestTakingPage from "@/pages/TestTakingPage";
import TestResultsPage from "@/pages/TestResultsPage";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="tests" element={<TestListPage />} />
            <Route path="test/:id" element={<TestTakingPage />} />
            <Route path="test-results" element={<TestResultsPage />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
