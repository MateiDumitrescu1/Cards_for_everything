import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// component imports
import Question from './components/Question.tsx'

import App from './App.tsx'
import './index.css'

const router = createBrowserRouter([
    {
        path: "/question",
        element: <Question />
    },
    {
        path: "/",
        element: <App />
    }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
