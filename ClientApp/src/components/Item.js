const Item = ({ item, drag, itemImgObj, onDelete }) => {
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this item?')) {
            onDelete && onDelete(item.id);
        }
    };

    return (
        <div className="unranked-cell">
            <img id={`item-${item.id}`} src={itemImgObj.image}
                style={{ cursor: "pointer" }} draggable="true" onDragStart={drag}
                alt={item.title}
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