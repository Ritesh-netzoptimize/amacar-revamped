import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuctionPage from './Pages/auction-page.jsx'
import ConditionAssessment from './Pages/ConditionAssessment'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/auction-page', element: <AuctionPage /> },
  { path: '/condition-assessment', element: <ConditionAssessment /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
