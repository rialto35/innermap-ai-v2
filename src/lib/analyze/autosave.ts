/**
 * Auto-save functionality
 * 
 * Dual-layer saving:
 * 1. LocalStorage (every 3 seconds, debounced)
 * 2. Server draft (every 10 questions or on blur)
 */

import { debounce } from '@/lib/utils';

const STORAGE_KEY = 'innermap_analyze_draft';
const DEBOUNCE_MS = 3000;
const SERVER_CHECKPOINT_INTERVAL = 10;

/**
 * Save to localStorage
 */
export function saveToLocal(answers: Record<string, number>): void {
  try {
    const data = {
      answers,
      timestamp: Date.now(),
      version: '1.1.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load from localStorage
 */
export function loadFromLocal(): Record<string, number> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Check if expired (older than 7 days)
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > MAX_AGE) {
      clearLocal();
      return null;
    }
    
    return data.answers || null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clear localStorage draft
 */
export function clearLocal(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Debounced save to localStorage
 */
export const debouncedSaveToLocal = debounce(saveToLocal, DEBOUNCE_MS);

/**
 * Save draft to server
 */
export async function saveToServer(
  answers: Record<string, number>,
  draftId?: string
): Promise<string | null> {
  try {
    const response = await fetch('/api/assess/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        draftId,
        answers,
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save draft');
    }
    
    const data = await response.json();
    return data.draftId || null;
  } catch (error) {
    console.error('Failed to save to server:', error);
    return null;
  }
}

/**
 * Check if should save to server (every N questions)
 */
export function shouldSaveToServer(answeredCount: number): boolean {
  return answeredCount > 0 && answeredCount % SERVER_CHECKPOINT_INTERVAL === 0;
}

/**
 * Auto-save manager
 */
export class AutoSaveManager {
  private lastServerSave: number = 0;
  
  constructor(
    private onSave: (draftId: string) => void,
    private onError: (error: Error) => void
  ) {}
  
  async save(
    answers: Record<string, number>,
    answeredCount: number,
    draftId?: string,
    force: boolean = false
  ): Promise<void> {
    // Always save to local
    debouncedSaveToLocal(answers);
    
    // Save to server if checkpoint reached or forced
    if (force || shouldSaveToServer(answeredCount)) {
      if (Date.now() - this.lastServerSave < 5000 && !force) {
        // Prevent too frequent server saves
        return;
      }
      
      try {
        const newDraftId = await saveToServer(answers, draftId);
        if (newDraftId) {
          this.onSave(newDraftId);
          this.lastServerSave = Date.now();
        }
      } catch (error) {
        this.onError(error as Error);
      }
    }
  }
}

