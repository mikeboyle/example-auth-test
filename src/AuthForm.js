import { useState } from 'react';
import { app } from './firebaseConfig';
import {
  browserSessionPersistence,
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import './AuthForm.css';

const AuthForm = ({ setCurrentUser }) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const auth = getAuth(app);

  const handleSubmit = (e, authFunc) => {
    e.preventDefault();

    const { email, password } = formData;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return authFunc(auth, email, password);
      })
      .then((userCredential) => {
        console.log('created user', userCredential.user);
        setCurrentUser(userCredential.user);
      })
      .catch((error) => {
        console.log('something went horribly wrong', JSON.stringify(error));
      });
  };

  const handleSignUpSubmit = (e) => {
    handleSubmit(e, createUserWithEmailAndPassword);
  };
  const handleSignInSubmit = (e) => {
    handleSubmit(e, signInWithEmailAndPassword);
  };

  const handleInput = (event, type) => {
    setFormData({ ...formData, [type]: event.target.value });
  };

  const toggleIsNewUser = () => {
    setIsNewUser(!isNewUser);
  };

  const title = isNewUser ? 'Sign Up' : 'Sign In';

  return (
    <section>
      <h1>{title}</h1>
      <form onSubmit={isNewUser ? handleSignUpSubmit : handleSignInSubmit}>
        <input
          type="email"
          placeholder="Your email"
          onChange={(e) => handleInput(e, 'email')}
        />
        <input
          type="password"
          placeholder="Your password"
          onChange={(e) => handleInput(e, 'password')}
        />
        <button type="submit">{isNewUser ? 'Sign up' : 'Sign in'}</button>
      </form>
      <button className="button--link-style" onClick={toggleIsNewUser}>
        {isNewUser
          ? 'Already have an account? Click here'
          : 'Need to create an account? Click here'}
      </button>
    </section>
  );
};

export default AuthForm;
