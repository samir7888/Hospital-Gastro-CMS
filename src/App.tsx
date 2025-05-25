import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctors from "./pages/doctors/Doctors";
import Doctor from "./pages/doctors/DoctorCreatePage";
import Appointments from "./pages/appointments/Appointments";
import Appointment from "./pages/appointments/Appointment";
import Faq from "./pages/faq/Faq";
import Feature from "./pages/features/Feature";
import Testimonials from "./testimonials/Testimonials";
import SingleTestimonial from "./testimonials/SingleTestimonial";
import SingleNewsPage from "./pages/news/SingleNewsPage";
import News from "./pages/news/News";
// import Footer from "./footer/Footer";
import Home from "./pages/Home/Home";
import DashboardPage from "./pages/dashboard/Dashboard";
import Applayout from "./components/layout/Applayout";
import TitlePage from "./title/Title";
import HeroPage from "./pages/pages/page";
import Settings from "./pages/settings/Settings";
import DoctorCreatePage from "./pages/doctors/DoctorCreatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Applayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pages" element={<HeroPage />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/new" element={<DoctorCreatePage />} />
          <Route path="/doctors/:id" element={<DoctorCreatePage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/:id" element={<Appointment />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/features" element={<Feature />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonials/:id" element={<SingleTestimonial />} />
          <Route path="/news/:id" element={<SingleNewsPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/title" element={<TitlePage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* <Footer /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
