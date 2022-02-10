import { CARDS } from "ammishka-shared/games";
import BaseSicilian from './base_sicilian_cards';

const getGameComponent = type => {
    if (!Object.values(CARDS.GAMES).includes(type)) return null;
    return BaseSicilian;
};

export default getGameComponent;