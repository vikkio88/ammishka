import React from 'react';
import { CARDS } from "ammishka-shared/games";

const getGameComponent = type => {
    if (!Object.values(CARDS.GAMES).includes(type)) return null;
    const Component = React.lazy(() => import(`./${type}`));
    return Component;
};

export default getGameComponent;