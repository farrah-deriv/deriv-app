import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';

type TUserRatingButton = {
    button_text: string;
    is_disabled?: boolean;
    large?: boolean;
    onClick: () => void;
};

const UserRatingButton = ({ button_text, is_disabled, large, onClick }: TUserRatingButton) => {
    return (
        <Button
            className={classNames('user-rating-button', { 'user-rating-button--big': large })}
            data-testid='dt_user_rating_button'
            is_disabled={is_disabled}
            secondary
            small
            onClick={!is_disabled ? onClick : undefined}
        >
            <Icon
                icon='IcFullStar'
                className='user-rating-button--icon'
                color={is_disabled ? 'disabled' : undefined}
                size={12}
            />
            <Text color='prominent' size='xxs' weight={large ? 'normal' : 'bold'}>
                {button_text}
            </Text>
        </Button>
    );
};

export default UserRatingButton;
