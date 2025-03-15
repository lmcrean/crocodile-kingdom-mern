import { describe, it, expect } from 'vitest';
import { ActionTypes } from '../../context/MockGameReducer';

describe('Game ActionTypes', () => {
  it('should define all required action types for card operations', () => {
    expect(ActionTypes.INITIALIZE_CARDS).toBe('INITIALIZE_CARDS');
    expect(ActionTypes.FLIP_CARD).toBe('FLIP_CARD');
    expect(ActionTypes.SELECT_CARD).toBe('SELECT_CARD');
    expect(ActionTypes.RESET_FLIPPED_CARDS).toBe('RESET_FLIPPED_CARDS');
    expect(ActionTypes.RESET_SELECTED_CARDS).toBe('RESET_SELECTED_CARDS');
    expect(ActionTypes.SET_MATCHED_PAIR).toBe('SET_MATCHED_PAIR');
    expect(ActionTypes.SET_CHECKING).toBe('SET_CHECKING');
    expect(ActionTypes.SET_ASSOCIATION).toBe('SET_ASSOCIATION');
  });
  
  it('should define all required action types for game progress', () => {
    expect(ActionTypes.START_GAME).toBe('START_GAME');
    expect(ActionTypes.END_GAME).toBe('END_GAME');
    expect(ActionTypes.RESET_GAME).toBe('RESET_GAME');
    expect(ActionTypes.INCREMENT_TURNS).toBe('INCREMENT_TURNS');
    expect(ActionTypes.DECREASE_TURNS_LEFT).toBe('DECREASE_TURNS_LEFT');
  });
  
  it('should define all required action types for audio', () => {
    expect(ActionTypes.TOGGLE_SOUND).toBe('TOGGLE_SOUND');
    expect(ActionTypes.TOGGLE_MUSIC).toBe('TOGGLE_MUSIC');
  });
  
  it('should define all required action types for scoring', () => {
    expect(ActionTypes.UPDATE_SCORE).toBe('UPDATE_SCORE');
    expect(ActionTypes.ADD_HIGH_SCORE).toBe('ADD_HIGH_SCORE');
  });
}); 