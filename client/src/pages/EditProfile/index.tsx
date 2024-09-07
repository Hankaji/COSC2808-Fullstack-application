import React, { FC, useState } from 'react';

const EditProfile: FC = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const formData = new FormData();
    if (username) formData.append('username', username);
    if (displayName) formData.append('displayName', displayName);
    if (email) formData.append('email', email);
    if (password) formData.append('password', password);
    if (profileImage) formData.append('profileImage', profileImage);

    try {
      const response = await fetch('http://localhost:8080/users/edit', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="edit-profile">
      <h2 style={{ color: 'black' }}>Edit Profile</h2>
      {message && <p style={{ color: 'black' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ color: 'black' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label style={{ color: 'black' }}>Display Name:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label style={{ color: 'black' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label style={{ color: 'black' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label style={{ color: 'black' }}>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label style={{ color: 'black' }}>Profile Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;