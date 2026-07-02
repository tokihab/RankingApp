import React, { useState } from 'react';

const API_BASE_URL = "/api";

const ItemUpload = ({ tierListId, itemType, onUploadComplete }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('item_type', itemType);
        formData.append('tier_list_id', tierListId);
        formData.append('ranking', 0); // Default to unranked

        try {
            const response = await fetch(`${API_BASE_URL}/item/create`, {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();
            if (data.success) {
                setTitle('');
                setImage(null);
                if (onUploadComplete) onUploadComplete();
            }
        } catch (error) {
            console.error('Error uploading item:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="item-upload">
            <h3>Add New Item</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                        />
                    </label>
                </div>
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Item'}
                </button>
            </form>
        </div>
    );
};

export default ItemUpload;