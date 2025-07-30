import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onSolve?: () => void;
  onReset?: () => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onPlayPause?: () => void;
  onToggleView?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Check for modifier keys
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    
    switch (event.key.toLowerCase()) {
      case 'enter':
        if (isCtrl && shortcuts.onSolve) {
          event.preventDefault();
          shortcuts.onSolve();
        }
        break;
      case 'r':
        if (isCtrl && shortcuts.onReset) {
          event.preventDefault();
          shortcuts.onReset();
        }
        break;
      case 'arrowright':
        if (shortcuts.onNextStep) {
          event.preventDefault();
          shortcuts.onNextStep();
        }
        break;
      case 'arrowleft':
        if (shortcuts.onPrevStep) {
          event.preventDefault();
          shortcuts.onPrevStep();
        }
        break;
      case ' ':
        if (shortcuts.onPlayPause) {
          event.preventDefault();
          shortcuts.onPlayPause();
        }
        break;
      case 'tab':
        if (isShift && shortcuts.onToggleView) {
          event.preventDefault();
          shortcuts.onToggleView();
        }
        break;
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};