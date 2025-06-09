import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { FormProvider } from './context/FormContext';
import NavigationBar from './components/Navigation/Navbar';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormPreview from './components/FormPreview/FormPreview';
import AdminPanel from './components/Admin/AdminPanel';
import UserForm from './components/UserForm/UserForm';
import ThankYou from './components/ThankYou/ThankYou';

import './App.css';

function App() {
  return (
    <FormProvider>
      <Router>
        <div className="App">
          <NavigationBar />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/admin/forms" replace />} />
              <Route path="/admin/forms" element={<AdminPanel />} />
              <Route path="/form-builder" element={<FormBuilder />} />
              <Route path="/form-preview" element={<FormPreview />} />
              <Route path="/userform/:formId" element={<UserForm />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </FormProvider>
  );
}

export default App;