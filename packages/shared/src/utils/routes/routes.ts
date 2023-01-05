import { getUrlSmartTrader, getUrlBinaryBot } from '../url/helpers';

export const routes = {
    error404: '/404',
    account: '/account',
    trading_assessment: '/account/trading-assessment',
    languages: '/account/languages',
    financial_assessment: '/account/financial-assessment',
    personal_details: '/account/personal-details',
    proof_of_identity: '/account/proof-of-identity',
    proof_of_address: '/account/proof-of-address',
    proof_of_ownership: '/account/proof-of-ownership',
    passwords: '/account/passwords',
    closing_account: '/account/closing-account',
    deactivate_account: '/account/deactivate-account', // TODO: Remove once mobile team has changed this link
    account_closed: '/account-closed',
    account_limits: '/account/account-limits',
    connected_apps: '/account/connected-apps',
    api_token: '/account/api-token',
    login_history: '/account/login-history',
    two_factor_authentication: '/account/two-factor-authentication',
    self_exclusion: '/account/self-exclusion',
    account_password: '/settings/account_password',
    apps: '/settings/apps',
    cashier_password: '/settings/cashier_password',
    contract: '/contract/:contract_id',
    exclusion: '/settings/exclusion',
    financial: '/settings/financial',
    history: '/settings/history',
    index: '/index',
    limits: '/settings/limits',
    mt5: '/mt5',
    dxtrade: '/derivx',
    personal: '/settings/personal',
    positions: '/reports/positions',
    profit: '/reports/profit',
    reports: '/reports',
    root: '/',
    reset_password: '/',
    redirect: '/redirect',
    settings: '/settings',
    statement: '/reports/statement',
    token: '/settings/token',
    trade: '/',
    bot: '/bot',
    cashier: '/cashier',
    cashier_deposit: '/cashier/deposit',
    cashier_withdrawal: '/cashier/withdrawal',
    cashier_pa: '/cashier/payment-agent',
    cashier_acc_transfer: '/cashier/account-transfer',
    cashier_crypto_transactions: '/cashier/crypto-transactions',
    // cashier_offramp: '/cashier/off-ramp',
    cashier_onramp: '/cashier/on-ramp',
    cashier_p2p: '/cashier/p2p',
    cashier_p2p_verification: '/cashier/p2p/verification',
    cashier_pa_transfer: '/cashier/payment-agent-transfer',
    smarttrader: getUrlSmartTrader(),
    binarybot: getUrlBinaryBot(),
    endpoint: '/endpoint',
    complaints_policy: '/complaints-policy',

    // Appstore
    appstore: '/appstore',
    trading_hub: '/appstore/traders-hub',
    onboarding: '/appstore/onboarding',
};
