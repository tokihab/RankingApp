import { useEffect, useState } from 'react';
import RankingGrid from "./RankingGrid";
import ItemCollection from "./ItemCollection";

const API_BASE_URL = "/api/item"; // Use proxy to .NET which will forward to PHP

const RankItems = ({ items, setItems, dataType, imgArr, localStorageKey, tierListId }) => {
    const [reload, setReload] = useState(false);

    function Reload() {
        setReload(true);
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drop(ev) {
        ev.preventDefault();
        const targetElm = ev.target;
        if (targetElm.nodeName === "IMG") {
            return false;
        }
        if (targetElm.childNodes.length === 0) {
            var data = parseInt(ev.dataTransfer.getData("text").substring(5));
            const transformedCollection = items.map((item) => (item.id === parseInt(data)) ?
                { ...item, ranking: parseInt(targetElm.id.substring(5)) } : { ...item, ranking: item.ranking });
            setItems(transformedCollection);
            // Update ranking in database
            updateItemRanking(data, parseInt(targetElm.id.substring(5)));
        }
    }

    function updateItemRanking(itemId, newRanking) {
        fetch(`${API_BASE_URL}/update.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: itemId, ranking: newRanking }),
        })
        .then(response => response.json())
        .catch(error => console.error('Error updating ranking:', error));
    }

    useEffect(() => {
        if (items == null) {
            getDataFromApi();
        }
    }, [dataType, tierListId]);

    function getDataFromApi() {
        let url = `${API_BASE_URL}/read.php?item_type=${dataType}`;
        if (tierListId) {
            url += `&tier_list_id=${tierListId}`;
        }
        fetch(url)
            .then((results) => results.json())
            .then(data => {
                setItems(data);
            })
            .catch(error => {
                setItems([]);
                console.error('Error fetching items:', error);
            });
    }

    useEffect(() => {
        if (items != null) {
            localStorage.setItem(localStorageKey, JSON.stringify(items));
        }
        setReload(false);
    }, [items])

    useEffect(() => {
        if (reload === true) {
            getDataFromApi();
        }
    }, [reload])

    return (
        (items != null) ?
            <main>
                <RankingGrid items={items} imgArr={imgArr} drag={drag} allowDrop={allowDrop} drop={drop} />
                <ItemCollection items={items} drag={drag} imgArr={imgArr} />
                <button onClick={Reload} className="reload" style={{ "marginTop": "10px" }}> <span className="text" >Reload</span > </button>
            </main>
            : <main>Loading...</main>
    )
}
export default RankItems;