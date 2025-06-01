import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { AuthGuard } from "./components/auth/auth-guard";
import LoginPage from "./pages/auth/login";
import Doctors from "./pages/doctors/Doctors";
import Appointments from "./pages/appointments/Appointments";
import Appointment from "./pages/appointments/Appointment";
import Testimonials from "./testimonials/Testimonials";
import SingleTestimonial from "./testimonials/SingleTestimonial";
import SingleNewsPage from "./pages/news/SingleNewsPage";
import News from "./pages/news/News";
import Home from "./pages/Home/Home";
import DashboardPage from "./pages/dashboard/Dashboard";
import Applayout from "./components/layout/Applayout";
import TitlePage from "./title/Title";
import HeroPage from "./pages/pages/page";
import Settings from "./pages/settings/Settings";
import SingleDoctorPage from "./pages/doctors/SingleDoctorPage";
import CategoryPage from "./pages/category/Category";
import FAQPage from "./pages/faq/FAQSection";
import ServicesPage from "./pages/features/SingleServicePage";
import ServicesListPage from "./pages/features/ServicesPage";
import CompanyInfoPage from "./pages/CompanyInfoPage";
import ForgotPassword from "./pages/auth/forget-password";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path='/forget-password' element={<ForgotPassword />} />
          {/* Protected Routes */}
          <Route
            element={
              <AuthGuard>
                <Applayout />
              </AuthGuard>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pages" element={<HeroPage />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/new" element={<SingleDoctorPage />} />
            <Route path="/doctors/:id" element={<SingleDoctorPage />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/:id" element={<Appointment />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/company-info" element={<CompanyInfoPage />} />
            <Route path="/services" element={<ServicesListPage />} />
            <Route path="/services/create" element={<ServicesPage />} />
            <Route path="/services/edit/:id" element={<ServicesPage />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/testimonials/new" element={<SingleTestimonial />} />
            <Route path="/testimonials/:id" element={<SingleTestimonial />} />
            <Route path="/news/category" element={<CategoryPage />} />
            <Route path="/news/category/:id" element={<CategoryPage />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<SingleNewsPage />} />
            <Route path="/news/new" element={<SingleNewsPage />} />
            <Route path="/title" element={<TitlePage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;