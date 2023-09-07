import React from 'react';
import { Button } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';

type TQuickAddModalButtonsProps = {
    className?: string;
    is_disabled: boolean;
    onCancel: () => void;
    onClickAdd: () => void;
};

const QuickAddModalButtons = ({ className, is_disabled, onCancel, onClickAdd }: TQuickAddModalButtonsProps) => {
    return (
        <React.Fragment>
            <Button has_effect large onClick={onCancel} secondary text={localize('Cancel')} />
            <Button
                className={className}
                has_effect
                is_disabled={is_disabled}
                large
                onClick={onClickAdd}
                primary
                text={localize('Add')}
            />
        </React.Fragment>
    );
};

export default observer(QuickAddModalButtons);
