import './App.css';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import AuthForm from './AuthForm';
import { app } from './firebaseConfig';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
      })
      .catch((error) => {
        console.log('oh noes!', JSON.stringify(error));
      });
  };

  const renderContent = () => {
    if (currentUser) {
      return (
        <section>
          <p>👋🏻 Hello, {currentUser.email}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </section>
      );
    } else {
      return (
        <section>
          <p>Welcome to the site! Please log in or sign up!</p>
          <AuthForm setCurrentUser={setCurrentUser} />
        </section>
      );
    }
  };

  return <div className="App">{!loading && renderContent()}</div>;
}

export default App;
