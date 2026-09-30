import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

describe('App smoke', () => {
  it('renders the setup screen without throwing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Predestined Path');
  });
});
