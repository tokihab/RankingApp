import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TierList.css';

const API_BASE_URL = "/api";

const TierListManager = () => {
    const [tierLists, setTierLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTierLists();
    }, []);

    const fetchTierLists = () => {
        fetch(`${API_BASE_URL}/tierlist/read.php`)
            .then(response => response.json())
            .then(data => setTierLists(data))
            .catch(error => console.error('Error fetching tier lists:', error));
    };

    const createTierList = (e) => {
        e.preventDefault();
        fetch(`${API_BASE_URL}/tierlist/create.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newListName }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setNewListName('');
                    fetchTierLists();
                }
            })
            .catch(error => console.error('Error creating tier list:', error));
    };

    const deleteTierList = (id) => {
        fetch(`${API_BASE_URL}/tierlist/delete.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchTierLists();
                }
            })
            .catch(error => console.error('Error deleting tier list:', error));
    };

    return (
        <div className="tier-list-manager">
            <h2>Your Tier Lists</h2>
            
            <form onSubmit={createTierList} className="create-list-form">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New tier list name"
                    required
                />
                <button type="submit">Create New List</button>
            </form>

            <div className="tier-lists">
                {tierLists.map(list => (
                    <div key={list.id} className="tier-list-item">
                        <h3>{list.name}</h3>
                        <div className="tier-list-actions">
                            <button onClick={() => navigate(`/start-ranking/${list.id}`)}>
                                Start Ranking
                            </button>
                            <button onClick={() => navigate(`/your-ranks/${list.id}`)}>
                                View Rankings
                            </button>
                            <button onClick={() => deleteTierList(list.id)} className="delete">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TierListManager;