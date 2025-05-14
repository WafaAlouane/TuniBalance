await axios.post('http://localhost:3001/friend-requests', {
    email: 'test@example.com'
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  