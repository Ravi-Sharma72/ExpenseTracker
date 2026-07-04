import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(name, email);
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1>User Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information</p>
      </header>

      <div className="glass-panel" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: 'white'
          }}>
            {name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2>{name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Member since {user.memberSince || '2023-01-01'}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-glass" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-glass" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
