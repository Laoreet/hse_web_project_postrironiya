import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Dashboard from '../Slots';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Slots', () => {
    it('renders slots table', async () => {
        const { getByText } = render(      <Router>
            <Dashboard />
        </Router>);

        await waitFor(() => getByText('Список слотов'));

        const tableHeaders = getByText('Время начала').closest('table').querySelectorAll('th');
        expect(tableHeaders).toHaveLength(7);
        expect(tableHeaders[0].textContent).toBe('Время начала');
        expect(tableHeaders[1].textContent).toBe('Имя');
        expect(tableHeaders[2].textContent).toBe('Фамилия');
        expect(tableHeaders[3].textContent).toBe('Email');
        expect(tableHeaders[4].textContent).toBe('Адрес');
        expect(tableHeaders[5].textContent).toBe('Этаж');
        expect(tableHeaders[6].textContent).toBe('Состояние');

        const slotsRows = getByText('Список слотов').closest('table').querySelectorAll('tbody tr');
        expect(slotsRows).toHaveLength(0);
    });
});