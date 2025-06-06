import { Theme } from '../types';

export const defaultTheme: Theme = {
  primary: '#2ed573',
  secondary: '#ff4757',
  accent: '#5352ed',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  surface: 'rgba(255, 255, 255, 0.05)',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  border: 'rgba(255, 255, 255, 0.2)',
  success: '#2ed573',
  warning: '#ffa502',
  error: '#ff4757'
};

export const darkTheme: Theme = {
  primary: '#00d2d3',
  secondary: '#ff6b6b',
  accent: '#4ecdc4',
  background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)',
  surface: 'rgba(255, 255, 255, 0.03)',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  border: 'rgba(255, 255, 255, 0.1)',
  success: '#00d2d3',
  warning: '#ffbe0b',
  error: '#ff6b6b'
};

export const lightTheme: Theme = {
  primary: '#007bff',
  secondary: '#dc3545',
  accent: '#6f42c1',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
  surface: 'rgba(0, 0, 0, 0.05)',
  text: '#212529',
  textSecondary: 'rgba(33, 37, 41, 0.7)',
  border: 'rgba(0, 0, 0, 0.2)',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545'
};