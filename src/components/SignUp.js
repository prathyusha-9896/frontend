import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleLogin } from '@react-oauth/google';
import { getAdditionalUserInfo, createUserWithEmailAndPassword,  signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const Signup = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log('User is authenticated:', currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Google Sign-Up
  const handleGoogleLoginSuccess = async (response) => {
    try {
      // Extract the credential from the Google response
      const credential = GoogleAuthProvider.credential(response.credential);
      const userCredential = await signInWithCredential(auth, credential);
  
      // Store the Google access token in localStorage
      localStorage.setItem('accessToken', response.credential);
  
      // Handle new or existing user logic
      const isNewUser = getAdditionalUserInfo(userCredential).isNewUser;
      if (isNewUser) {
        console.log('New user signed up with Google:', userCredential.user.email);
        alert('Google Sign-Up Successful!');
      } else {
        console.log('Existing user logged in with Google:', userCredential.user.email);
        alert('Google Login Successful!');
      }
  
      onLoginSuccess(); // Optional callback after login
      navigate('/');
    } catch (error) {
      console.error('Google sign-up error:', error);
      setError('Google login failed. Please try again.');
    }
  };
  

  const handleGoogleLoginFailure = (response) => {
    console.error('Google login failed:', response);
    setError('Google login failed. Please try again.');
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user in MongoDB or your database
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: password,
          userId: user.uid,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User stored in MongoDB:', data);
        alert('Signup successful!');
        onLoginSuccess();
        navigate('/');
      } else {
        console.error('Error storing user in MongoDB:', data);
        setError(`Error: ${data.msg}`);
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in.');
      } else {
        console.error('Signup error:', error);
        setError(`Error: ${error.message}`);
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-full max-w-md mx-auto">
        <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
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
            Sign Up
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>

        {/* Google Sign-Up Button */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Sign up with Google"
          className="w-full mb-4"
        />

        <div className="text-center mt-4">
          <span className="text-teal-600">Already have an account?</span>
          <button 
            onClick={handleLoginRedirect} 
            className="btn btn-outline-secondary hover:bg-teal-600 ml-2">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
