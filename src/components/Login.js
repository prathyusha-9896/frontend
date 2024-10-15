import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      onLoginSuccess();
      navigate('/'); // Redirect to the home page after successful login
    } catch (error) {
      console.error('Error logging in:', error.message);

      // Handle specific error messages
      if (error.code === 'auth/user-not-found') {
        setError('You don’t have an account, please sign up.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format. Please check and try again.');
      } else {
        setError('Error logging in: ' + error.message);
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login successful:', response);
    onLoginSuccess();
    navigate('/'); // Redirect to home page after successful Google login
  };

  const handleGoogleLoginFailure = (response) => {
    console.error('Google login failed:', response);
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800 w-full mb-4">
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          clientId="1070666646612-k29u9uttmshfaa1lip3kj9b8pdn4im3j.apps.googleusercontent.com"
          buttonText="Login with Google"
          className="w-full mb-4"
        />

        <div className="text-center mt-4">
          <span className="text-teal-600">Don't have an account?</span>
          <button
            onClick={handleSignupRedirect}
            className="btn btn-outline-secondary hover:bg-teal-600 ml-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
