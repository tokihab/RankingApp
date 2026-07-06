const Item = ({ item, drag, itemImgObj, onDelete }) => {
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this item?')) {
            onDelete && onDelete(item.id);
        }
    };

    // Helper function to guarantee the correct absolute image URL
    const getImageUrl = (path) => {
        if (!path) return '';
        
        // If it's already a full absolute URL, leave it alone
        if (path.startsWith('http')) return path;
        
        // Remove leading slash if it exists
        let cleanPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Strip out old or new folder prefixes so we just get 'uploads/filename.jpg'
        cleanPath = cleanPath.replace('api/item/', '').replace('tierapp/item/', '');
        
        // Route through the uploads proxy so HTTPS pages can load images safely
        return `/api/item/uploads/${cleanPath}`;
    };

    // FIX: Look at the database row (item.image) first!
    const imagePath = item.image || item.image_path || (itemImgObj ? itemImgObj.image : '');

    return (
        <div className="unranked-cell">
            <img 
                id={`item-${item.id}`} 
                src={getImageUrl(imagePath)}
                style={{ cursor: "pointer" }} 
                draggable="true" 
                onDragStart={drag}
                alt={item.title || "Tier list item"}
            />
            <button 
                className="delete-item-btn" 
                onClick={handleDelete}
                title="Delete item"
            >×</button>
        </div>
    )
}
export default Item;