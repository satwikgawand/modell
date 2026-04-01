import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import GalleryPage from './pages/GalleryPage'
import ModelPage from './pages/ModelPage'
import ComparePage from './pages/ComparePage'
import TimelinePage from './pages/TimelinePage'
import BuildPage from './pages/BuildPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/model/:slug" element={<ModelPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/build" element={<BuildPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
