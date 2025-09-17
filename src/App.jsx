// src/App.jsx
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin' // Import Admin
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Menu />
        <About />
        <Contact />
        <Admin /> {/* Add Admin section */}
      </main>
      <Footer />
    </div>
  )
}

export default App;