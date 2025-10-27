import Item from './Item';

const ItemCollection = ({ items = [], drag, imgArr = [] }) => {

    return (
        <div className="items-not-ranked">
            {
                Array.isArray(items) ? items.map((item) => (item.ranking === 0)
                    ? <Item key={`item-${item.id}`} item={item} drag={drag}
                        itemImgObj={{ image: `http://localhost/api/uploads/${item.image_path}` }} />
                    : null)
                    : null
            }
        </div>
    )
}
export default ItemCollection;