import React from 'react';
import { localize } from 'Components/i18next';
import UserRatingButton from 'Pages/orders/user-rating-button';
import StarRating from 'Components/star-rating';

type TRatingCellRendererProps = {
    has_review_details?: boolean;
    is_reviewable?: boolean;
    rating?: number;
    onClickUserRatingButton: () => void;
};

const RatingCellRenderer = ({
    has_review_details,
    is_reviewable,
    rating,
    onClickUserRatingButton,
}: TRatingCellRendererProps) => {
    if (has_review_details)
        return (
            <div className='rating-cell-renderer'>
                <StarRating
                    empty_star_className='rating-cell-renderer__star'
                    empty_star_icon='IcEmptyStar'
                    full_star_className='rating-cell-renderer__star'
                    full_star_icon='IcFullStar'
                    initial_value={rating}
                    rating_value={rating ?? 0}
                    is_readonly
                    number_of_stars={5}
                    should_allow_hover_effect={false}
                    star_size={15}
                />
            </div>
        );
    return (
        <UserRatingButton
            button_text={localize('Rate')}
            is_disabled={!is_reviewable}
            onClick={onClickUserRatingButton}
        />
    );
};

export default RatingCellRenderer;
