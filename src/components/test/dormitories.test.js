import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../Dormitories';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Dormitory', () => {
    it('renders dormitories list', async () => {
        const { getByText } = render( <Router>
            <Dashboard />
        </Router>);
        expect(getByText('Общежития')).toBeInTheDocument();
        expect(getByText('Список общежитий')).toBeInTheDocument();
    });

    it('renders students list when dormitory is clicked', async () => {
        const { getByText, getAllByRole } = render(<Router> <Dashboard /> </Router>);
        await waitFor(() => getByText('Список общежитий'));
        await waitFor(() => getAllByRole('listitem')); // Wait for the li elements to be rendered
        const dormitoryList = getAllByRole('listitem');
        fireEvent.click(dormitoryList[0]);
        await waitFor(() => getByText((content, element) => {
            const hasText = element.textContent.includes('Список студентов в общежитии');
            const elementType = element.tagName.toLowerCase();
            return hasText && elementType === 'h2';
        }));
    });

});