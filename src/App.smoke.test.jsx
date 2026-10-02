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
  });
});
