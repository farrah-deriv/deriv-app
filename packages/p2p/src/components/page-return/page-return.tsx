import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';

type TPageReturnProps = {
    className?: string;
    onClick: () => void;
    page_title: string;
};

const PageReturn = ({ className = '', onClick, page_title }: TPageReturnProps) => {
    return (
        <div className={classNames('page-return', className)}>
            <div onClick={onClick} className='page-return__button' data-testid='dt_page_return'>
                <Icon icon='IcArrowLeftBold' />
            </div>
            <Text line_height='l' weight='bold'>
                {page_title}
            </Text>
        </div>
    );
};

export default PageReturn;
