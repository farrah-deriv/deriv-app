import React from 'react';
import { Modals } from 'Constants/modals';
import { useModalManagerContext } from './modal-manager-context';
import { TModal, TState } from './modal-manager-context-provider';

const ModalManager = () => {
    const { modal, modal_props, stacked_modal } = useModalManagerContext() as TState;

    const { key } = modal as TModal;
    const Modal = Modals[key];
    const StackedModal = stacked_modal ? Modals[stacked_modal.key] : null;

    const getModalProps = (current_modal: TModal) => {
        if (current_modal?.props && Object.keys(current_modal.props).length > 0) {
            // if props was provided to the argument and it was also already initialised using useRegisterModalProps,
            // merge the 2 props together and update latest prop values with the passed prop argument
            if (modal_props.has(current_modal.key)) {
                return {
                    ...modal_props.get(current_modal.key),
                    ...current_modal.props,
                };
            }
            return current_modal.props;
        }
        if (modal_props.has(current_modal.key)) {
            return modal_props.get(current_modal.key);
        }
        return {};
    };

    if (Modal && modal)
        return (
            <React.Suspense fallback={null}>
                <Modal {...getModalProps(modal)} />
                {StackedModal && stacked_modal && (
                    <React.Suspense fallback={null}>
                        <StackedModal {...getModalProps(stacked_modal)} />
                    </React.Suspense>
                )}
            </React.Suspense>
        );

    return null;
};

export default ModalManager;
