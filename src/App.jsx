import './App.css';
import {Button} from "./components/ui/button";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/app-layout';
import LandingPage from "./pages/LandingPage";
import OnBoarding from './pages/OnBoarding';
import JobListing from "./pages/JobListing";
import Job from "./pages/Job";
import PostJob from "./pages/PostJob";
import SavedJobs from "./pages/SavedJobs";
import MyJobs from "./pages/MyJobs";
import { ThemeProvider } from './components/ThemeProvider';

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />
        },
        {
          path: "/onboarding",
          element: <OnBoarding />
        },
        {
          path: "/jobs",
          element: <JobListing />
        },
        {
          path: "/job/:id",
          element: <Job />
        },
        {
          path: "/post-job",
          element: <PostJob />
        },
        {
          path: "/saved-jobs",
          element: <SavedJobs />
        },
        {
          path: "/my-jobs",
          element: <MyJobs />
        }
      ]
    }
  ])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
