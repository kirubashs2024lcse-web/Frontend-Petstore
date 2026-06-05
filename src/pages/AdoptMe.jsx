import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdoptMe = () => {
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

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
            <img src={pet.image} alt={pet.petName} />
            <div className="pet-info">
              <h3>{pet.petName}</h3>
              <p className="pet-meta">{pet.species} · {pet.breed} · {pet.age} yr{pet.age !== 1 ? 's' : ''}</p>
              <p>{pet.description}</p>
              <button className="btn btn-primary" onClick={() => setSelected(pet)}>Adopt Me 🐾</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty-msg">No pets available for adoption right now.</p>}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <h2>Adopt {selected.petName}</h2>
            <img src={selected.image} alt={selected.petName} className="modal-img" />
            <div className="modal-body">
              <h3>Pet Details</h3>
              <p><strong>Species:</strong> {selected.species}</p>
              <p><strong>Breed:</strong> {selected.breed}</p>
              <p><strong>Age:</strong> {selected.age} yr{selected.age !== 1 ? 's' : ''}</p>
              <p><strong>About:</strong> {selected.description}</p>
              <hr />
              <h3>Seller / Owner Details</h3>
              <p><strong>Name:</strong> {selected.ownerName}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${selected.phone}`}>{selected.phone}</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptMe;
