import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WordAssociationModal from '../WordAssociation';
import { vi } from 'vitest';

describe('WordAssociationModal', () => {
  const mockCards = [
    { id: '1', word: 'banana', imagePath: '/images/banana.jpg' },
    { id: '2', word: 'monkey', imagePath: '/images/monkey.jpg' }
  ];

  const mockClose = vi.fn();
  const mockSubmit = vi.fn();

  const renderModal = (props = {}) => {
    return render(
      <WordAssociationModal
        isOpen={true}
        onClose={mockClose}
        onSubmit={mockSubmit}
        cards={mockCards}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage debug mode
    localStorage.removeItem('debugMode');
  });

  test('renders correctly when open', () => {
    renderModal();
    
    expect(screen.getByTestId('word-association-modal')).toBeInTheDocument();
    expect(screen.getByText('Word Association Challenge')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('monkey')).toBeInTheDocument();
    expect(screen.getByTestId('association-input')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderModal({ isOpen: false });
    
    expect(screen.queryByTestId('word-association-modal')).not.toBeInTheDocument();
  });

  test('does not render with invalid cards prop', () => {
    renderModal({ cards: [] });
    
    expect(screen.queryByTestId('word-association-modal')).not.toBeInTheDocument();
  });

  test('handles text input', () => {
    renderModal();
    
    const input = screen.getByTestId('association-input');
    fireEvent.change(input, { target: { value: 'The banana is eaten by the monkey' } });
    
    expect(input.value).toBe('The banana is eaten by the monkey');
  });

  test('prevents submission with empty input', async () => {
    renderModal();
    
    const submitButton = screen.getByTestId('submit-association');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a sentence before submitting.')).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();
  });

  test('prevents submission with just spaces', async () => {
    renderModal();
    
    const input = screen.getByTestId('association-input');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const submitButton = screen.getByTestId('submit-association');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a sentence before submitting.')).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('prevents submission without both words', async () => {
    renderModal();
    
    const input = screen.getByTestId('association-input');
    fireEvent.change(input, { target: { value: 'The banana is yellow and tasty' } });
    
    const submitButton = screen.getByTestId('submit-association');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Your sentence must include the word: monkey/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('prevents submission with too few words', async () => {
    renderModal();
    
    const input = screen.getByTestId('association-input');
    fireEvent.change(input, { target: { value: 'banana and monkey' } });
    
    const submitButton = screen.getByTestId('submit-association');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Your sentence should be at least 5 words long.')).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('submits valid input', async () => {
    renderModal();
    
    const input = screen.getByTestId('association-input');
    fireEvent.change(input, { target: { value: 'The banana is eaten by the monkey in the zoo' } });
    
    const submitButton = screen.getByTestId('submit-association');
    fireEvent.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalledWith(
      'The banana is eaten by the monkey in the zoo',
      ['1', '2']
    );
    expect(mockClose).toHaveBeenCalled();
  });

  test('closes modal when cancel button is clicked', () => {
    renderModal();
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockClose).toHaveBeenCalled();
  });

  test('shows debug buttons when debug mode is enabled', async () => {
    localStorage.setItem('debugMode', 'true');
    
    renderModal();
    
    expect(screen.getByText('Generate Valid Sentence')).toBeInTheDocument();
    expect(screen.getByText('Quick Valid')).toBeInTheDocument();
  });

  test('prefills valid text in debug mode', async () => {
    localStorage.setItem('debugMode', 'true');
    
    renderModal();
    
    const input = screen.getByTestId('association-input');
    expect(input.value).toContain('banana');
    expect(input.value).toContain('monkey');
  });

  test('generate valid sentence button works', async () => {
    localStorage.setItem('debugMode', 'true');
    
    renderModal();
    
    const generateButton = screen.getByText('Generate Valid Sentence');
    fireEvent.click(generateButton);
    
    const input = screen.getByTestId('association-input');
    expect(input.value).not.toBe('');
    expect(input.value).toContain('banana');
    expect(input.value).toContain('monkey');
  });

  test('quick valid button works', async () => {
    localStorage.setItem('debugMode', 'true');
    
    renderModal();
    
    const quickButton = screen.getByText('Quick Valid');
    fireEvent.click(quickButton);
    
    const input = screen.getByTestId('association-input');
    expect(input.value).toBe('test association');
  });
}); 