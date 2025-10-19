/**
 * Inner9 Configuration
 * Controls feature toggles and behavior
 */

export const INNER9_USE_TYPE_WEIGHTS = process.env.INNER9_USE_TYPE_WEIGHTS !== "false";
export const INNER9_USE_LLM_ENHANCEMENT = process.env.INNER9_USE_LLM_ENHANCEMENT === "true";
export const INNER9_CACHE_DURATION = parseInt(process.env.INNER9_CACHE_DURATION || "300"); // 5 minutes

/**
 * Get Inner9 configuration for current environment
 */
export function getInner9Config() {
  return {
    useTypeWeights: INNER9_USE_TYPE_WEIGHTS,
    useLLMEnhancement: INNER9_USE_LLM_ENHANCEMENT,
    cacheDuration: INNER9_CACHE_DURATION,
    isDevelopment: process.env.NODE_ENV === 'development'
  };
}
