import PropTypes from 'prop-types';
import React from 'react';
import { Field, useFormikContext} from 'formik';
import { DesktopWrapper, Input, Icon, MobileWrapper, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { useInterval } from '@deriv/components/src/hooks';

const Timer = (props) => {
    const initial_time = 60;
    const [remaining_time, setRemainingTime] = React.useState(initial_time);
   
    useInterval(() => {
        if (remaining_time > 0) {
            setRemainingTime(remaining_time - 1);
        }
    }, 1000);
    React.useEffect(() => {
        if(remaining_time === 0) {
            props.onComplete();
            setRemainingTime(initial_time);
        }
    });

    return (
        <Text as='p' size='xs' className='timer'>
            <Localize i18n_default_text='{{remaining_time}}s'
                values={{ remaining_time }}/>
        </Text>
    );
};

const InputGroup = ({ children, className }) => {
    return (
        <fieldset>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const CryptoFiatConverter = ({
    crypto_amount,
    fiat_amount,
    from_currency,
    hint,
    insufficient_fund_error,
    is_timer_visible,
    onChangeCryptoAmount,
    onChangeFiatAmount,
    resetTimer,
    setCryptoAmount,
    setFiatAmount,
    setIsTimerVisible,
    to_currency,
    validateFromAmount,
    validateToAmount,
}) => {
    const { errors, values, touched, handleBlur, handleChange, setFieldError, setFieldTouched } = useFormikContext();
    const [arrow_icon_direction, setArrowIconDirection] = React.useState('right');

    React.useEffect(() => {
        return () => resetTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='crypto-fiat-converter-form'>
            <Field name='crypto_amount' validate={validateFromAmount}>
                {({ field }) => (
                    <Input
                        {...field}
                        onFocus={() =>{
                            setArrowIconDirection('right'); 
                        }}
                        onBlur={e => {
                            handleBlur(e);
                            if(!is_timer_visible) {
                                if(!values.crypto_amount || errors.crypto_amount) {
                                    setFiatAmount('');
                                } else {
                                    onChangeCryptoAmount(e, from_currency, to_currency);
                                }
                            } 
                            setFieldError('fiat_amount', '');
                        }}
                        onChange={e => {
                            setFieldError('crypto_amount', '');
                            setIsTimerVisible(false);
                            handleChange(e);
                            setCryptoAmount(e.target.value);   
                        }}
                        type='text'
                        error={touched.crypto_amount && errors.crypto_amount}
                        label={localize('Amount ({{currency}})', {currency: from_currency})}
                        value={crypto_amount}
                        autoComplete='off'
                        required
                        hint={hint}
                    />
                )}
            </Field>
            <MobileWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowDownBold' /> : <Icon icon='IcArrowUpBold' />}
            </MobileWrapper>
            <DesktopWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowRightBold' /> : <Icon icon='IcArrowLeftBold' />}
            </DesktopWrapper>
            <Field name='fiat_amount' validate={validateToAmount}>
                {({ field }) => (
                    <InputGroup className='input-group'>
                        <Input
                            {...field}
                            onFocus={() =>{
                                setArrowIconDirection('left'); 
                            }}
                            onBlur={e => {
                                handleBlur(e);
                                if(!is_timer_visible){
                                    if(!values.fiat_amount || errors.fiat_amount) {
                                        setCryptoAmount('');
                                    } else {
                                        onChangeFiatAmount(e, to_currency, from_currency);
                                    }
                                }
                                setFieldError('crypto_amount', '');    
                            }}
                            onChange={e => {
                                setIsTimerVisible(false);
                                handleChange(e);
                                setFiatAmount(e.target.value);       
                            }}
                            type='text'
                            error={(touched.fiat_amount && errors.fiat_amount) || insufficient_fund_error}
                            label={localize('Amount ({{currency}})', {currency: to_currency})}
                            value={fiat_amount}
                            autoComplete='off'
                        />
                        {is_timer_visible && <Timer onComplete={() => {
                            onChangeCryptoAmount({
                                target: {
                                    value: crypto_amount,
                                },
                            }, from_currency, to_currency);
                        }} /> }
                    </InputGroup>
                )}
            </Field>
            <Text as='p' size='xxs' className='crypto-fiat-converter-form__text'>
                <Localize i18n_default_text='Approximate value' />
            </Text>
        </div>
    );
};

CryptoFiatConverter.propTypes = {
    crypto_amount: PropTypes.string,
    fiat_amount: PropTypes.string,
    from_currency: PropTypes.string,
    insufficient_fund_error: PropTypes.string,
    is_timer_visible: PropTypes.bool,
    onChangeCryptoAmount: PropTypes.func,
    onChangeFiatAmount: PropTypes.func,
    resetTimer: PropTypes.func,
    setCryptoAmount: PropTypes.func,
    setFiatAmount: PropTypes.func,
    setIsTimerVisible: PropTypes.func,
    to_currency: PropTypes.string,
    validateFromAmount: PropTypes.func,
    validateToAmount: PropTypes.func,
};

export default connect(({ modules }) => ({
    crypto_amount: modules.cashier.crypto_amount,
    fiat_amount: modules.cashier.fiat_amount,
    insufficient_fund_error: modules.cashier.insufficient_fund_error,
    is_timer_visible: modules.cashier.is_timer_visible,
    onChangeCryptoAmount: modules.cashier.onChangeCryptoAmount,
    onChangeFiatAmount: modules.cashier.onChangeFiatAmount,
    resetTimer: modules.cashier.resetTimer,
    setCryptoAmount: modules.cashier.setCryptoAmount,
    setFiatAmount: modules.cashier.setFiatAmount,
    setIsTimerVisible: modules.cashier.setIsTimerVisible,
}))(CryptoFiatConverter);
