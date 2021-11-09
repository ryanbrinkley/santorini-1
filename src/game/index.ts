import { ActivePlayers } from 'boardgame.io/core';
import { Ctx } from 'boardgame.io';
import { GAME_ID } from '../config';
import {
  EndTurn, CharacterAbility, Move, Select, Build, Place, updateValids, CheckWinByTrap,
} from './moves';
import { characterList, getCharacter } from './characters';
import { SetChar, Ready, CancelReady } from './moves/charSelectMoves';
import { GameState, Space } from '../types/GameTypes';
import { Character, CharacterState } from '../types/CharacterTypes';

export function initCharacter(characterName: string): CharacterState {
  const character: Character = getCharacter(characterName);

  const {
    desc, buttonActive, buttonText, moveUpHeight, workers,
    numWorkers, numWorkersToPlace, selectedWorker, attrs,
  } = character;

  return {
    name: characterName,
    desc,
    buttonActive,
    buttonText,
    moveUpHeight,
    workers,
    numWorkers,
    numWorkersToPlace,
    selectedWorker,
    attrs,
  };
}

function setRandomCharacters(G: GameState, ctx: Ctx) {
  for (let i = 0; i < ctx.numPlayers; i++) {
    const listOnlyCharacters = characterList.slice(1);
    if (G.players[i].char.name === 'Random') {
      const randomCharName = (
        listOnlyCharacters[Math.floor(Math.random() * (listOnlyCharacters.length))]
      );
      G.players[i].char = initCharacter(randomCharName);
    }
  }
}

function getFirstPlayer(G: GameState): number {
  let startingPlayer = 0;
  if (G.players['1'].char.name === 'Bia') {
    startingPlayer = 1;
  }
  return startingPlayer;
}

export const SantoriniGame = {
  name: GAME_ID,
  minPlayers: 2,
  maxPlayers: 2,

  setup: () => {
    const players = {
      0: {
        id: '0',
        opponentId: '1',
        ready: false,
        char: initCharacter('Random'),
      },
      1: {
        id: '1',
        opponentId: '0',
        ready: false,
        char: initCharacter('Random'),
      },
    };

    const spaces: Space[] = [];
    for (let i = 0; i < 25; i++) {
      spaces.push({
        pos: i,
        height: 0,
        inhabitant: undefined,
        isDomed: false,
      });
    }

    const initialState: GameState = {
      players,
      spaces,
      valids: [],
    };

    return initialState;
  },

  phases: {
    selectCharacters: {
      start: true,
      next: 'placeWorkers',
      endIf: (G: GameState) => G.players['0'].ready && G.players['1'].ready,
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      moves: {
        SetChar,
        Ready,
        CancelReady,
      },
      onEnd: (G: GameState, ctx: Ctx) => {
        setRandomCharacters(G, ctx);
      },
    },

    placeWorkers: {
      next: 'main',
      onBegin: (G: GameState, ctx: Ctx) => {
        const p1 = G.players['0'];
        const p2 = G.players['1'];
        const p1charData = p1.char;
        const p2charData = p2.char;

        const p1Char: Character = getCharacter(p1charData.name);
        const p2Char: Character = getCharacter(p2charData.name);

        p1Char.initialize(G, ctx, p1, p1charData);
        p2Char.initialize(G, ctx, p1, p2charData);
      },
      turn: {
        activePlayers: { currentPlayer: 'place' },
        order: {
          first: (G: GameState, ctx: Ctx) => getFirstPlayer(G),
          next: (G: GameState, ctx: Ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          place: { moves: { Place } },
          end: { moves: { EndTurn } },
        },
        onBegin: (G: GameState, ctx: Ctx) => {
          const currPlayer = G.players[ctx.currentPlayer];
          updateValids(G, ctx, currPlayer, 'place');
        },
        onEnd: (G: GameState, ctx: Ctx) => {
          if (G.players['0'].char.numWorkersToPlace === 0
            && G.players['1'].char.numWorkersToPlace === 0) {
            ctx.events?.endPhase();
          }
        },
      },
    },

    main: {
      turn: {
        activePlayers: { currentPlayer: 'select' },
        order: {
          first: (G: GameState, ctx: Ctx) => getFirstPlayer(G),
          next: (G: GameState, ctx: Ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          select: { moves: { Select, CharacterAbility } },
          move: { moves: { Move, CharacterAbility } },
          build: { moves: { Build, CharacterAbility } },
          end: { moves: { EndTurn } },
        },
        onBegin: (G: GameState, ctx: Ctx) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);
          updateValids(G, ctx, currPlayer, 'select');
          char.onTurnBegin(G, ctx, currPlayer, currPlayer.char);
        },
        onEnd: (G: GameState, ctx: Ctx) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);
          char.onTurnEnd(G, ctx, currPlayer, currPlayer.char);

          G.players['0'].char.selectedWorker = -1;
          G.players['1'].char.selectedWorker = -1;

          CheckWinByTrap(G, ctx);
        },
      },
    },
  },
};
