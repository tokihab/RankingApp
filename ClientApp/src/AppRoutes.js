import Home from "./components/Home.js";
import TierListManager from "./components/TierListManager";
import StartRankingContainer from "./components/StartRankingContainer";
import YourRanksContainer from "./components/YourRanksContainer";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/your-ranks',
        element: <YourRanksContainer />
    },
    {
        path: '/start-ranking/:tierListId',
        element: <StartRankingContainer />
    },
    {
        path: '/your-ranks/:tierListId',
        element: <YourRanksContainer />
    }
];

export default AppRoutes;