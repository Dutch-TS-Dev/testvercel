/**
 * This file contains utility functions for authentication in the application.
 */

export const isValidToken = (token: unknown): boolean => {
  if (!token || typeof token !== 'object' || !('exp' in token) || typeof token.exp !== 'number') {
    return false;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return token.exp > currentTime;
};

export const getTokenExpiryDate = (token: { exp: number }): Date => {
  return new Date(token.exp * 1000);
};

export const formatExpiryDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTokenCreationDate = (token: { iat: number }): Date => {
  return new Date(token.iat * 1000);
};