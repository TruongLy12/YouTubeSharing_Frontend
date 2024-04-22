import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route exact path='/' element={<ProtectedRoute/>}>
                        <Route exact path='/home' element={<Home/>}/>
                    </Route>
                </Routes>
            </Router>
      </AuthProvider>      
    );
};

export default App;
