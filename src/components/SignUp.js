import { useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword } from '../firebase';  // import the auth object from firebase.js

const Signup = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);  // Track logged-in user

  useEffect(() => {
    // Add listener to check authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);  // Update state with the currently authenticated user
      if (currentUser) {
        console.log('User is authenticated:', currentUser.email);
      }
    });

    return () => unsubscribe();  // Cleanup on component unmount
  }, []);

  
  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      // Check if email is already registered using Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
      // Get the authenticated user
      const user = userCredential.user;
      console.log('Signup successful:', user);
  
      // After Firebase signup, store user in MongoDB
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: password,
        }),
      });
  
      // Parse JSON response
      const data = await response.json();
      if (response.ok) {
        console.log('User stored in MongoDB:', data);
        alert('Signup successful! Please log in.');
      } else {
        console.error('Error storing user in MongoDB:', data);
        setError(`Error: ${data.msg}`);
      }
    } catch (error) {
      // Firebase authentication error (like email already in use)
      if (error.code === 'auth/email-already-in-use') {
        console.error('Signup error: Email is already in use');
        setError('Email is already in use. Please try a different email.');
      } else {
        console.error('Signup error:', error);
        setError(`Error: ${error.message}`);
      }
    }
  };
  
  

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Sign Up</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {/* Show user info if authenticated */}
      {user && <p>Welcome, {user.email}</p>}
    </div>
  );
};

export default Signup;
