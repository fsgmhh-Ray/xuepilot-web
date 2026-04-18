import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // 引入我们在 Canvas 里编写的核心基座

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)