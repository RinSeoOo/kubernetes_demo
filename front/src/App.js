import React, { useState, useEffect } from 'react';
import { fetchTestDb, login, updateScore } from './api';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [newScore, setNewScore] = useState(score);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTestDbData = async () => {
      try {
        const data = await fetchTestDb();
        setData(data);
        console.log(data);
      } catch (error) {
        setError(error);
      }
    };
    getTestDbData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      if (user) {
        setIsLoggedIn(true);
        setScore(user.score);
        setNewScore(user.score);
      } else {
        alert('로그인 정보가 올바르지 않습니다.');
      }
    } catch (error) {
      alert(`로그인 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setNewScore(0);
  };

  const handleScoreUpdate = async () => {
    try {
      await updateScore(username, newScore);
      setScore(newScore);
      alert('점수가 업데이트되었습니다.');
    } catch (error) {
      alert('점수 업데이트 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <div>
          <h2>Welcome, {username}!</h2>
          <p>Your score is: <strong>{score}</strong></p>
          <div>
            <input
              type="number"
              placeholder="Update Score"
              value={newScore}
              onChange={(e) => setNewScore(Number(e.target.value))}
            />
            <button onClick={handleScoreUpdate}>Update Score</button>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
      <div>
        <h3>Test Data</h3>
        {error && <p>Error: {error.message}</p>}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
