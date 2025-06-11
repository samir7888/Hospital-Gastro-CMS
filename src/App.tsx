import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, Component } from "react";
import type { ReactNode, ComponentType } from "react";
import { AuthProvider } from "./context/auth-context";
import { AuthGuard } from "./components/auth/auth-guard";
import PersistentRefreshToken from "./components/PersistantRefreshToken";

// TypeScript interfaces
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface LazyComponentProps {
  [key: string]: any;
}

// Loading fallback components
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const ComponentLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <p className="text-gray-500 text-sm">Loading component...</p>
    </div>
  </div>
);

const FormLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
      </div>
      <p className="text-gray-400 text-xs mt-4">Preparing form...</p>
    </div>
  </div>
);

// Error Boundary Component
class LazyLoadErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Lazy loading error:", error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to Load Component
            </h3>
            <p className="text-red-600 text-sm mb-4">
              There was an error loading this page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loaded components - Public pages
const LoginPage = lazy(() => import("./pages/auth/login"));
const ForgetPasswordPage = lazy(() => import("./pages/auth/forget-password"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const Home = lazy(() => import("./pages/Home/Home"));

// Lazy loaded components - Protected pages
const Applayout = lazy(() => import("./components/layout/Applayout"));
const DashboardPage = lazy(() => import("./pages/dashboard/Dashboard"));
const HeroPage = lazy(() => import("./pages/pages/page"));

// Doctor related pages
const Doctors = lazy(() => import("./pages/doctors/Doctors"));
const SingleDoctorPage = lazy(() => import("./pages/doctors/SingleDoctorPage"));

// Appointment related pages
const Appointments = lazy(() => import("./pages/appointments/Appointments"));
const Appointment = lazy(() => import("./pages/appointments/Appointment"));

// Feature related pages
const FeaturesPage = lazy(() => import("./pages/features/Features"));
const SingleFeaturePage = lazy(
  () => import("./pages/features/SingleFeaturePage")
);
const FeatureForm = lazy(() =>
  import("./components/forms/feature-form").then((module) => ({
    default: module.FeatureForm,
  }))
);

// Content related pages
const FAQPage = lazy(() => import("./pages/faq/FAQSection"));
const CompanyInfoPage = lazy(() => import("./pages/CompanyInfoPage"));

// Service related pages
const ServicesListPage = lazy(() => import("./pages/services/ServicesPage"));
const ServicesPage = lazy(() => import("./pages/services/SingleServicePage"));

// Testimonial related pages
const Testimonials = lazy(() => import("./testimonials/Testimonials"));
const SingleTestimonial = lazy(
  () => import("./testimonials/SingleTestimonial")
);

// News related pages
const CategoryPage = lazy(() => import("./pages/category/Category"));
const News = lazy(() => import("./pages/news/News"));
const SingleNewsPage = lazy(() => import("./pages/news/SingleNewsPage"));

// Settings and account pages
const MainSettingPage = lazy(() => import("./pages/settings/MainSettingPage"));
const ChangePassword = lazy(() => import("./pages/auth/change-password"));
const UpdateEmailForm = lazy(() => import("./pages/auth/change-email"));

// Higher Order Component for lazy loading with custom fallback
const withLazyLoading = <P extends LazyComponentProps>(
  Component: ComponentType<P>,
  fallback: ReactNode = <ComponentLoader />
): React.FC<P> => {
  const LazyComponent: React.FC<P> = (props: P) => (
    <LazyLoadErrorBoundary>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );

  // Set display name for better debugging
  LazyComponent.displayName = `withLazyLoading(${
    Component.displayName || Component.name || "Component"
  })`;

  return LazyComponent;
};

// Wrapped components with appropriate fallbacks
const LazyHome = withLazyLoading(Home, <PageLoader />);
const LazyLoginPage = withLazyLoading(LoginPage, <PageLoader />);
const LazyForgetPasswordPage = withLazyLoading(
  ForgetPasswordPage,
  <PageLoader />
);
const LazyResetPassword = withLazyLoading(ResetPassword, <PageLoader />);

const LazyApplayout = withLazyLoading(Applayout, <PageLoader />);
const LazyDashboardPage = withLazyLoading(DashboardPage);
const LazyHeroPage = withLazyLoading(HeroPage);

const LazyDoctors = withLazyLoading(Doctors);
const LazySingleDoctorPage = withLazyLoading(SingleDoctorPage, <FormLoader />);

const LazyAppointments = withLazyLoading(Appointments);
const LazyAppointment = withLazyLoading(Appointment, <FormLoader />);

const LazyFeaturesPage = withLazyLoading(FeaturesPage);
const LazySingleFeaturePage = withLazyLoading(
  SingleFeaturePage,
  <FormLoader />
);
const LazyFeatureForm = withLazyLoading(FeatureForm, <FormLoader />);

const LazyFAQPage = withLazyLoading(FAQPage);
const LazyCompanyInfoPage = withLazyLoading(CompanyInfoPage, <FormLoader />);

const LazyServicesListPage = withLazyLoading(ServicesListPage);
const LazyServicesPage = withLazyLoading(ServicesPage, <FormLoader />);

const LazyTestimonials = withLazyLoading(Testimonials);
const LazySingleTestimonial = withLazyLoading(
  SingleTestimonial,
  <FormLoader />
);

const LazyCategoryPage = withLazyLoading(CategoryPage);
const LazyNews = withLazyLoading(News);
const LazySingleNewsPage = withLazyLoading(SingleNewsPage, <FormLoader />);

const LazyMainSettingPage = withLazyLoading(MainSettingPage, <FormLoader />);
const LazyChangePassword = withLazyLoading(ChangePassword, <FormLoader />);
const LazyUpdateEmailForm = withLazyLoading(UpdateEmailForm, <FormLoader />);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with lazy loading */}
          <Route path="/" element={<LazyHome />} />
          <Route path="/login" element={<LazyLoginPage />} />
          <Route path="/forgot-password" element={<LazyForgetPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<LazyResetPassword />}
          />

          {/* Protected Routes with lazy loading */}
          <Route
            element={
              <PersistentRefreshToken>
                <AuthGuard>
                  <LazyApplayout />
                </AuthGuard>
              </PersistentRefreshToken>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<LazyDashboardPage />} />

            {/* Pages */}
            <Route path="/pages" element={<LazyHeroPage />} />

            {/* Doctor Routes */}
            <Route path="/doctors" element={<LazyDoctors />} />
            <Route path="/doctors/new" element={<LazySingleDoctorPage />} />
            <Route path="/doctors/:id" element={<LazySingleDoctorPage />} />

            {/* Appointment Routes */}
            <Route path="/appointments" element={<LazyAppointments />} />
            <Route path="/appointments/:id" element={<LazyAppointment />} />

            {/* Feature Routes */}
            <Route path="/features" element={<LazyFeaturesPage />} />
            <Route path="/features/new" element={<LazyFeatureForm />} />
            <Route path="/features/:id" element={<LazySingleFeaturePage />} />

            {/* Content Management Routes */}
            <Route path="/faq" element={<LazyFAQPage />} />
            <Route path="/company-info" element={<LazyCompanyInfoPage />} />

            {/* Service Routes */}
            <Route path="/services" element={<LazyServicesListPage />} />
            <Route path="/services/create" element={<LazyServicesPage />} />
            <Route path="/services/edit/:id" element={<LazyServicesPage />} />

            {/* Testimonial Routes */}
            <Route path="/testimonials" element={<LazyTestimonials />} />
            <Route
              path="/testimonials/new"
              element={<LazySingleTestimonial />}
            />
            <Route
              path="/testimonials/:id"
              element={<LazySingleTestimonial />}
            />

            {/* News Routes */}
            <Route path="/news/category" element={<LazyCategoryPage />} />
            <Route path="/news/category/:id" element={<LazyCategoryPage />} />
            <Route path="/news" element={<LazyNews />} />
            <Route path="/news/:id" element={<LazySingleNewsPage />} />
            <Route path="/news/new" element={<LazySingleNewsPage />} />

            {/* Settings Routes */}
            <Route path="/settings" element={<LazyMainSettingPage />} />
            <Route path="/change-password" element={<LazyChangePassword />} />
            <Route path="/change-email" element={<LazyUpdateEmailForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
