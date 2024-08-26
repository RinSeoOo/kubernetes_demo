// src/api.js
const API_URL = 'http://10.0.20.131:30001';

export const fetchTestDb = async () => {
  try {
    const response = await fetch(`${API_URL}/test-db`);
    if (!response.ok) {
      throw new Error('네트워크 연결의 오류 발생');
    }
    return await response.json();
  } catch (error) {
    console.error('test-db 연결 오류 발생:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('네트워크 연결의 오류 발생');
    }
    return await response.json();
  } catch (error) {
    console.error('로그인 에러 발생:', error);
    throw error;
  }
};


export const updateScore = async (username, score) => {
  try {
    const response = await fetch(`${API_URL}/update-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score }),
    });
    if (!response.ok) {
      throw new Error('네트워크 연결의 오류 발생');
    }
    return await response.json();
  } catch (error) {
    console.error('점수 업데이트 에러:', error);
    throw error;
  }
};
