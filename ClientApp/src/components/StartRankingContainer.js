import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RankItems from './RankItems';
import ItemUpload from './ItemUpload';
import './TierList.css';

const API_BASE_URL = "/api";

const StartRankingContainer = () => {
    const { tierListId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);               
    const [tierListName, setTierListName] = useState('');
    const itemType = 1; // Always use type 1 for tier list items

    useEffect(() => {
        // Fetch tier list details and items
        const fetchData = async () => {
            try {
                // Fetch tier list details
                const listResponse = await fetch(`${API_BASE_URL}/tierlist/read?id=${tierListId}`);
                const listData = await listResponse.json();
                if (listData && listData.name) {
                    setTierListName(listData.name);
                }

                // Fetch items for this tier list
                const itemsResponse = await fetch(`${API_BASE_URL}/item/read?item_type=${itemType}&tier_list_id=${tierListId}`);
                const itemsData = await itemsResponse.json();
                setItems(Array.isArray(itemsData) ? itemsData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tierListId]);

    const handleUploadComplete = () => {
        // Refresh items after upload
        fetch(`${API_BASE_URL}/item/read?item_type=${itemType}&tier_list_id=${tierListId}`)
            .then(res => res.json())
            .then(data => setItems(Array.isArray(data) ? data : []));
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all rankings?')) {
            // Reset all items to ranking 0
            const resetPromises = items.map(item =>
                fetch(`${API_BASE_URL}/item/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id, ranking: 0 }),
                })
            );

            Promise.all(resetPromises)
                .then(() => handleUploadComplete())
                .catch(error => console.error('Error resetting rankings:', error));
        }
    };

    const handleBack = () => {
        navigate('/your-ranks');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/item/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemId }),
            });
            if (response.ok) {
                handleUploadComplete();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="ranking-container">
            {/* Header with back button and title */}
            <div className="ranking-header">
                <button onClick={handleBack} className="back-button">← Back to Lists</button>
                <h2>{tierListName || 'Ranking'}</h2>
                <button onClick={handleReset} className="reset-button">Reset Rankings</button>
            </div>

            {/* Grid */}
            <div className="ranking-grid-section">
            <RankItems
                items={items}
                setItems={setItems}
                dataType={itemType}
                tierListId={tierListId}
                localStorageKey={`tierlist-${tierListId}`}
                onRefresh={handleUploadComplete}
                onDeleteItem={handleDelete}
            />
            </div>

            {/* Upload section at the bottom */}
            <div className="upload-section">
                <ItemUpload
                    tierListId={tierListId}
                    itemType={itemType}
                    onUploadComplete={handleUploadComplete}
                />
            </div>
        </div>
    );
};

export default StartRankingContainer;