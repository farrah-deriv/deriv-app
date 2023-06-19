import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';
import FormError from 'Components/section-error';

type TComplainFooterProps = {
    error_message: string;
    dispute_reason: string;
    onClickSubmitButton: () => void;
    onClickCloseButton: () => void;
};

const OrderDetailsComplainModalFooter = ({
    error_message,
    dispute_reason,
    onClickCloseButton,
    onClickSubmitButton,
}: TComplainFooterProps) => {
    return (
        <React.Fragment>
            {error_message && <FormError message={error_message} />}
            <Button.Group>
                <Button secondary type='button' onClick={onClickCloseButton} large>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button is_disabled={!dispute_reason} primary large onClick={onClickSubmitButton}>
                    <Localize i18n_default_text='Submit' />
                </Button>
            </Button.Group>
        </React.Fragment>
    );
};

export default OrderDetailsComplainModalFooter;
