import { useState } from 'react';
import Item from './Item';

const ItemCollection = ({ items = [], drag, imgArr = [], onDelete, allowDrop, drop }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (ev) => {
        allowDrop(ev);
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    return (
        <div 
            className={`items-not-ranked ${isDraggingOver ? 'drag-over' : ''}`}
            onDrop={(ev) => { drop(ev); setIsDraggingOver(false); }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {
                Array.isArray(items) ? items.map((item) => (item.ranking === 0)
                    ? <Item key={`item-${item.id}`} item={item} drag={drag}
                        itemImgObj={{ image: `/api/item/uploads/${item.image_path}` }} 
                        onDelete={onDelete} />
                    : null)
                    : null
            }
        </div>
    )
}
export default ItemCollection;