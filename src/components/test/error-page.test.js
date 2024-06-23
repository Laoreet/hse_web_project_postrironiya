import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorPage from '../Error-page';

describe('ErrorPage', () => {
    it('renders error message', () => {
        render(<ErrorPage />);

        expect(screen.getByText('Упс!')).toBeInTheDocument();
        expect(screen.getByText('Что-то пошло не так.')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
    it('has a div with id "error-page"', () => {
        render(<ErrorPage />);

        expect(screen.getByTestId('error-page')).toBeInTheDocument();
    });


});