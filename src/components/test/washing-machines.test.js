import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../WashingMachines';

describe('Washing Mashing', () => {
    it('renders dashboard when user is authorized', async () => {
        localStorage.setItem('user', JSON.stringify({ dormitory: 1 }));
        const { getByText } = render(<Router><Dashboard /></Router>);
        await waitFor(() => getByText('Список стиральных машин'));
        expect(getByText('Список стиральных машин')).toBeInTheDocument();
    });

});