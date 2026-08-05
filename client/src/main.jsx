import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux"
import { setupInterceptors } from './api/axiosInterceptor.js'
import store from './redux/store.js'

setupInterceptors(store)  // register interceptors before any component renders

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     
        <Provider store={store}>
          <App />
        </Provider>
      
    </BrowserRouter>
  </StrictMode>,
)
