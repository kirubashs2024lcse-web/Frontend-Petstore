import { useState, useEffect } from 'react';
import API from '../api/axios';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const AdoptMe = () => {
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    API.get('/pets/approved')
      .then((res) => setPets(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = filter === 'All' ? pets : pets.filter((p) => p.species === filter);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pets Available for Adoption</h1>
        <p>Give a pet a loving home today</p>
      </div>
      <div className="filter-bar">
        {['All', 'Dog', 'Cat', 'Bird', 'Other'].map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="pets-grid">
        {filtered.map((pet) => (
          <div key={pet._id} className="pet-card">
            <img src={`${BASE_URL}${pet.image}`} alt={pet.petName} />
            <div className="pet-info">
              <h3>{pet.petName}</h3>
              <p className="pet-meta">{pet.species} · {pet.breed} · {pet.age} yr{pet.age !== 1 ? 's' : ''}</p>
              <p>{pet.description}</p>
              <button className="btn btn-primary">Adopt Me 🐾</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty-msg">No pets available for adoption right now.</p>}
      </div>
    </div>
  );
};

export default AdoptMe;
