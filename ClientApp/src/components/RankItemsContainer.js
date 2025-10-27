import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RankItems from './RankItems';
import ItemUpload from './ItemUpload';

const RankItemsContainer = ({ dataType, imgArr }) => {
    const { tierListId } = useParams();
    const albumLocalStorageKey = "albums";
    const movieLocalStorageKey = "movies";

    var localStorageKey = "";

    const [albumItems, setAlbumItems] = useState(null);
    const [movieItems, setMovieItems] = useState(null);


    var data = [];
    var setFunc = null;

    if (dataType === 1) {
        data = movieItems;
        setFunc = setMovieItems;
        localStorageKey = movieLocalStorageKey;
    }
    else if (dataType === 2) {
        data = albumItems;
        setFunc = setAlbumItems;
        localStorageKey = albumLocalStorageKey;
    }

    const handleUploadComplete = () => {
        // Refresh the items list after a new upload
        setFunc(null); // This will trigger a reload in RankItems
    };

    return (
        <div>
            <ItemUpload 
                tierListId={tierListId} 
                itemType={dataType}
                onUploadComplete={handleUploadComplete}
            />
            <RankItems 
                items={data} 
                setItems={setFunc} 
                dataType={dataType} 
                imgArr={imgArr} 
                localStorageKey={localStorageKey} 
                tierListId={tierListId} 
            />
        </div>
    );
};

export default RankItemsContainer;