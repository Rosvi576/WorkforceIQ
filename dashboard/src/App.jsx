
import { lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

const Overview = lazy(() =>
  import("./pages/Overview")
);

const Departments = lazy(() =>
  import("./pages/Departments")
);

const RiskFactors = lazy(() =>
  import("./pages/RiskFactors")
);

const Prediction = lazy(() =>
  import("./pages/Prediction")
);

const ModelInsights = lazy(() =>
  import("./pages/ModelInsights")
);

const About = lazy(() =>
  import("./pages/About")
);

export default function App() {

  return (

    <BrowserRouter>

      <ScrollToTop />

      <Suspense
        fallback={
          <Loading message="Loading WorkforceIQ..." />
        }
      >

        <Routes>

          <Route element={<DashboardLayout />}>

            <Route
              index
              element={<Overview />}
            />

            <Route
              path="departments"
              element={<Departments />}
            />

            <Route
              path="risk-factors"
              element={<RiskFactors />}
            />

            <Route
              path="prediction"
              element={<Prediction />}
            />

            <Route
              path="model-insights"
              element={<ModelInsights />}
            />

            <Route
              path="about"
              element={<About />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Route>

        </Routes>

      </Suspense>

    </BrowserRouter>

  );

}
