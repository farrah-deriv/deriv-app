import React from 'react';
import { render, screen } from '@testing-library/react';
import UserRatingButton from '../user-rating-button';
import userEvent from '@testing-library/user-event';

const mock_onclick = jest.fn();

describe('<UserRatingButton />', () => {
    it('should render UserRatingButton component with passed props', () => {
        render(<UserRatingButton button_text={'test'} onClick={mock_onclick} />);

        expect(screen.getByTestId('dt_user_rating_button')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();

        userEvent.click(screen.getByTestId('dt_user_rating_button'));
        expect(mock_onclick).toHaveBeenCalled();
    });

    it('should have appropriate classnames when large prop is passed', () => {
        render(<UserRatingButton button_text={'test'} large onClick={mock_onclick} />);
        expect(screen.getByTestId('dt_user_rating_button')).toHaveClass('user-rating-button--big');
    });

    it('should be disabled when is_disabled prop is passed', () => {
        render(<UserRatingButton button_text={'test'} is_disabled onClick={mock_onclick} />);
        const rating_button = screen.getByTestId('dt_user_rating_button');

        expect(rating_button).toBeDisabled();

        userEvent.click(rating_button);
        expect(mock_onclick).not.toHaveBeenCalled();
    });
});
