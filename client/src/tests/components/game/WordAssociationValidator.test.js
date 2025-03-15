import { describe, it, expect } from 'vitest';
import { validateAssociation } from '../../../utils/wordAssociation';

describe('Word Association Validation', () => {
  it('returns true for valid associations that contain both words', () => {
    const result = validateAssociation('The boat is sailing in the ocean', 'boat', 'ocean');
    expect(result).toBe(true);
  });

  it('returns false if association does not contain both words', () => {
    const result = validateAssociation('The ship is sailing in the sea', 'boat', 'ocean');
    expect(result).toBe(false);
  });

  it('returns false if association is too short', () => {
    const result = validateAssociation('boat ocean', 'boat', 'ocean');
    expect(result).toBe(false);
  });

  it('requires a complete sentence (has subject and verb)', () => {
    const result = validateAssociation('Boats and oceans', 'boat', 'ocean');
    expect(result).toBe(false);
  });
}); 