import { useContext, createContext } from 'react';
import { BoardProps } from 'boardgame.io/react';
import { GameState } from '../types/GameTypes';

export const BoardContext = createContext({} as BoardProps<GameState>);
export const useBoardContext = () => useContext(BoardContext);
