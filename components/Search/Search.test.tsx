import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search', () => {
  it('renders input with placeholder', () => {
    render(<Search value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Поиск')).toBeInTheDocument();
  });

  it('displays value', () => {
    render(<Search value="test query" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = jest.fn();
    render(<Search value="" onChange={onChange} />);
    const input = screen.getByRole('searchbox', { name: /поиск/i });
    fireEvent.change(input, { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
