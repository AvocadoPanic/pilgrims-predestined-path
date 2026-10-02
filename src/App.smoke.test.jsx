import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

describe('App smoke', () => {
  it('renders the setup screen without throwing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Predestined Path');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).toContain('>dev<');
    expect(html).not.toContain('A new version will load');
    expect(html).not.toContain('Loading the new version');
    expect(html).not.toMatch(/<button[^>]*disabled/);
    expect(html).not.toContain('Install this game');
    expect(html).not.toContain('Add to Home Screen');
  });
});
