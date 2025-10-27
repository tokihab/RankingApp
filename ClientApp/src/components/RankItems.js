import { useEffect, useState, useCallback } from 'react';
import RankingGrid from "./RankingGrid";
import ItemCollection from "./ItemCollection";

const API_BASE_URL = "/api/item"; // Use proxy to .NET which will forward to PHP

const RankItems = ({ items, setItems, dataType, imgArr, localStorageKey, tierListId, onDeleteItem }) => {
    const [reload, setReload] = useState(false);

    const getDataFromApi = useCallback(() => {
        let url = `${API_BASE_URL}/read.php`;
        if (tierListId) {
            url += `?tier_list_id=${tierListId}`;
        } else if (dataType) {
            url += `?item_type=${dataType}`;
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
    }, [tierListId, dataType, setItems]);

    function Reload() {
        setReload(!reload);
        getDataFromApi();
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
        
        // Don't allow dropping on images
        if (targetElm.nodeName === "IMG") {
            return false;
        }
        
        var data = parseInt(ev.dataTransfer.getData("text").substring(5));
        
        // If dropped on a rank cell (has id starting with "rank-")
        if (targetElm.id && targetElm.id.startsWith("rank-")) {
            if (targetElm.childNodes.length === 0) {
                const ranking = parseInt(targetElm.id.substring(5));
                const transformedCollection = items.map((item) => (item.id === parseInt(data)) ?
                    { ...item, ranking: ranking } : { ...item, ranking: item.ranking });
                setItems(transformedCollection);
                updateItemRanking(data, ranking);
            }
        }
        // If dropped on unranked section or unranked items
        else if (targetElm.className === "items-not-ranked" || targetElm.closest(".items-not-ranked")) {
            const transformedCollection = items.map((item) => (item.id === parseInt(data)) ?
                { ...item, ranking: 0 } : { ...item, ranking: item.ranking });
            setItems(transformedCollection);
            updateItemRanking(data, 0);
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
        if (!items || items.length === 0) {
            getDataFromApi();
        }
    }, [getDataFromApi, items.length]);

    useEffect(() => {
        if (items != null && localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(items));
        }
    }, [items, localStorageKey])

    return (
        (items != null) ?
            <main>
                <RankingGrid items={items} imgArr={imgArr} drag={drag} allowDrop={allowDrop} drop={drop} />
                <ItemCollection items={items} drag={drag} imgArr={imgArr} onDelete={onDeleteItem} allowDrop={allowDrop} drop={drop} />
            </main>
            : <main>Loading...</main>
    )
}
export default RankItems;