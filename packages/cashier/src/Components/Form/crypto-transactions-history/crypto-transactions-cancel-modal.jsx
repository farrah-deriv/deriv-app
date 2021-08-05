import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CryptoTransactionsCancelModal = ({
        cancelCryptoTransaction, 
        hideCryptoTransactionsCancelModal, 
        is_crypto_transactions_cancel_modal_open, 
        selected_crypto_transaction_id,
    }) => {
    return (
        <React.Fragment>
            <Modal
                small
                title={localize('Cancel transaction')}
                is_open={is_crypto_transactions_cancel_modal_open}
                toggleModal={hideCryptoTransactionsCancelModal}
                has_close_icon
            >
                <Modal.Body>
                    <Localize i18n_default_text='Are you sure you want to cancel this transaction?' />
                </Modal.Body>
                <Modal.Footer>
                    <Button text={localize('No')} onClick={hideCryptoTransactionsCancelModal} large secondary />
                    <Button
                        text={localize('Yes')}
                        onClick={() => {
                            cancelCryptoTransaction(selected_crypto_transaction_id);
                        }}
                        large
                        primary
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

CryptoTransactionsCancelModal.propTypes = {
    cancelCryptoTransaction: PropTypes.func,
    hideCryptoTransactionsCancelModal: PropTypes.func,
    is_crypto_transactions_cancel_modal_open: PropTypes.bool,
    selected_crypto_transaction_id: PropTypes.string,
};

export default connect(({ modules }) => ({
    cancelCryptoTransaction: modules.cashier.cancelCryptoTransaction,
    hideCryptoTransactionsCancelModal: modules.cashier.hideCryptoTransactionsCancelModal,
    is_crypto_transactions_cancel_modal_open: modules.cashier.is_crypto_transactions_cancel_modal_open,
    selected_crypto_transaction_id: modules.cashier.selected_crypto_transaction_id,
}))(CryptoTransactionsCancelModal);
