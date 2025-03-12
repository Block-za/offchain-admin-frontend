import { useState } from 'react'
import './App.css'
import EventForm from './components/EventForm'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Event Management</h1>
      </header>
      <main>
        <EventForm />
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default App