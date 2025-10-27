import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './TierList.css';

const API_BASE_URL = "/api";

const YourRanksContainer = () => {
    const navigate = useNavigate();
    const [tierLists, setTierLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchTierLists();
    }, []);

    const fetchTierLists = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/tierlist/read.php`)
            .then(async res => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    setTierLists(Array.isArray(data) ? data : []);
                } catch (e) {
                    console.error('Invalid JSON from tierlist/read.php:', text);
                    setTierLists([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tier lists:', error);
                setLoading(false);
            });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim() || creating) return;

        setCreating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/tierlist/create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim() }),
            });

            const text = await response.text();
            let data = null;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Non-JSON response from create.php:', text);
                alert('Server error creating tier list: ' + text);
                setCreating(false);
                return;
            }

            console.log('Create response:', data);

            if (data && data.success && data.id) {
                setNewName('');
                await fetchTierLists();
                navigate(`/start-ranking/${data.id}`);
            } else {
                alert((data && data.message) ? data.message : 'Failed to create tier list. Please try again.');
            }
        } catch (error) {
            console.error('Error creating tier list:', error);
            alert('Error creating tier list. Check console for details.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tier list?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/tierlist/delete.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const text = await response.text();
            let data = null;
            try { data = JSON.parse(text); } catch (e) { console.error('Non-JSON response from delete.php:', text); }

            if (data && data.success) {
                await fetchTierLists();
            } else {
                alert((data && data.message) ? data.message : 'Failed to delete tier list. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting tier list:', error);
            alert('Error deleting tier list. Please try again.');
        }
    };

    return (
        <div className="your-ranks-container">
            <div className="tier-list-header">
                <h2>Have Fun!</h2>
                <p>Create a new tier list or continue ranking your existing ones.</p>
            </div>

            <div className="create-section">
                <form onSubmit={handleCreate} className="create-list-form">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter name for new tier list"
                        disabled={creating}
                        required
                    />
                    <button type="submit" className="create-button" disabled={creating}>
                        {creating ? 'Creating...' : 'Create New Tier List'}
                    </button>
                </form>
            </div>

            <div className="existing-lists">
                <h3>Your Tier Lists</h3>
                {loading ? (
                    <div className="loading">Loading your tier lists...</div>
                ) : tierLists.length === 0 ? (
                    <div className="no-lists">
                        <p>You haven't created any tier lists yet.</p>
                        <p>Create one above to get started!</p>
                    </div>
                ) : (
                    <div className="tier-lists-grid">
                        {tierLists.map(list => (
                            <div key={list.id} className="tier-list-card">
                                <h4>{list.name}</h4>
                                <div className="tier-list-actions">
                                    <button 
                                        onClick={() => navigate(`/start-ranking/${list.id}`)}
                                        className="edit-button"
                                    >
                                        Continue Ranking
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(list.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default YourRanksContainer;