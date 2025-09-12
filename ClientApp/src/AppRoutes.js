import RankItemsContainer from "./components/RankItemsContainer";
import MovieImageArr from "./components/MovieImages.js";
import AlbumImageArr from "./components/AlbumImages.js";
import Home from "./components/Home.js";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/rank-movies',
        element: <RankItemsContainer dataType={1} imgArr={MovieImageArr} />
    },
    {
        path: '/rank-albums',
        element: <RankItemsContainer dataType={2} imgArr={AlbumImageArr} />
    }
];

export default AppRoutes;