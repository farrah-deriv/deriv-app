import React from 'react';
import { render, screen } from '@testing-library/react';
import RatingCellRenderer from '../rating-cell-renderer';

jest.mock('Components/star-rating', () => {
    const StarRating = () => <div>Star Rating</div>;
    return StarRating;
});

describe('<RatingCellRenderer />', () => {
    it('should render rate button', () => {
        const props = {
            has_review_details: false,
            is_reviewable: true,
            rating: 0,
            onClickUserRatingButton: jest.fn(),
        };
        render(<RatingCellRenderer {...props} />);
        expect(screen.getByText('Rate')).toBeInTheDocument();
    });

    it('should render star rating', () => {
        const props = {
            has_review_details: true,
            is_reviewable: true,
            rating: 5,
            onClickUserRatingButton: jest.fn(),
        };
        render(<RatingCellRenderer {...props} />);
        expect(screen.getByText('Star Rating')).toBeInTheDocument();
    });

    it('should render star rating with 0 rating', () => {
        const props = {
            has_review_details: true,
            is_reviewable: true,
            onClickUserRatingButton: jest.fn(),
        };
        render(<RatingCellRenderer {...props} />);
        expect(screen.getByText('Star Rating')).toBeInTheDocument();
    });
});
