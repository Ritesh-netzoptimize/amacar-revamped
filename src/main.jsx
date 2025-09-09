import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuctionPage from './Pages/auction-page.jsx'
import ConditionAssessment from './Pages/ConditionAssessment'
import ExteriorPhotos from './Pages/ExteriorPhotos'
import ReviewPage from './Pages/ReviewPage'
import DashBoard from './Pages/Dashboard'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/auction-page', element: <AuctionPage /> },
  { path: '/condition-assessment', element: <ConditionAssessment /> },
  { path: '/local-auction', element: <ExteriorPhotos /> },
  { path: '/national-auction', element: <ExteriorPhotos /> },
  { path: '/review', element: <ReviewPage /> },
  { path: '/dashboard', element: <DashBoard /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
