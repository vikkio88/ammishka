import { createStoreon } from 'storeon';

import app from './modules/app';
import ui from './modules/ui';
import game from './modules/game';
import gameSetup from './modules/gameSetup';

export const store = createStoreon([app, ui, game, gameSetup]);
