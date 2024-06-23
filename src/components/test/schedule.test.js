import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SlotSchedule  from '../SlotsSchedule';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SlotSchedule', () => {
    it('renders slot schedule', () => {
        const user = {
            mail: 'johndoe@example.com',
            dormitory: 1,
        };
        localStorage.setItem('user', JSON.stringify(user));

        const { getByText } = render(<Router><SlotSchedule /></Router>);

        expect(getByText('Слоты')).toBeInTheDocument();
        expect(getByText('Выберите дату')).toBeInTheDocument();
        expect(getByText('Choose an option:')).toBeInTheDocument();
    });

    it('allows selecting a date', () => {
        const user = {
            mail: 'johndoe@example.com',
            dormitory: 1,
        };
        localStorage.setItem('user', JSON.stringify(user));

        const { getByText, getByRole } = render(<Router><SlotSchedule /></Router> );

        const selectElement = getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: '2024-06-25' } });

        expect(getByText('You selected: 2024-06-25')).toBeInTheDocument();
    });

    it('renders slot matrix', async () => {
        const user = {
            mail: 'johndoe@example.com',
            dormitory: 1,

        };
        localStorage.setItem('user', JSON.stringify(user));

        const {getByText, getByRole} = render(<Router><SlotSchedule/></Router>);
        const selectElement = getByRole('combobox');
        fireEvent.change(selectElement, {target: {value: '2024-06-25'}});
        expect(getByText('Список слотов')).toBeInTheDocument();
        await waitFor(() => getByText('5 этаж'));
        expect(getByText('5 этаж')).toBeInTheDocument();
        await waitFor(() => getByText('09:00'));
        expect(getByText('09:00')).toBeInTheDocument();
    });

    it('allows choosing a slot', async () => {
        const user = {
            mail: 'johndoe@example.com',
            dormitory: 1,
        };
        localStorage.setItem('user', JSON.stringify(user));

        const {getByText, getByRole} = render(<Router><SlotSchedule/></Router>);
        const selectElement = getByRole('combobox');
        fireEvent.change(selectElement, {target: {value: '2024-06-25'}});
        await waitFor(() => getByText('5 этаж'));
        expect(getByText('5 этаж')).toBeInTheDocument();
        await waitFor(() => getByText('09:00'));
        expect(getByText('09:00')).toBeInTheDocument();
        const buttonElement = getByRole('button', {name: '09:00'});
        fireEvent.click(buttonElement);
        await waitFor(() => getByText('У вас имеется запись на 2024-06-25 09:00 на 5 этаже'));
        expect(getByText('У вас имеется запись на 2024-06-25 09:00 на 5 этаже')).toBeInTheDocument();
    });
});