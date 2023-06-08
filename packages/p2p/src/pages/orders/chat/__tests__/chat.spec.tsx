import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessage from 'Utils/chat-message';
import { useStores } from 'Stores';
import Chat from '../chat';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';

const mock_order_store = {
    order_information: {
        other_user_details: {
            name: 'Test user',
        },
    },
    hideDetails: jest.fn(),
};

const mock_channel = {
    cachedReadReceiptStatus: {
        test: 1,
    },
    url: 'p2porder_CR_28_1686124713',
    channelType: 'group',
    name: 'Chat about order 28',
    coverUrl: 'https://static.sendbird.com/sample/cover/cover_11.jpg',
    creator: null,
    createdAt: 1686124713000,
    data: '',
    customType: '',
    isFrozen: true,
    isEphemeral: false,
    isDistinct: false,
    isSuper: false,
    isBroadcast: false,
    isPublic: false,
    unreadMessageCount: 0,
    inviter: null,
    members: [
        {
            nickname: 'client CR90000181',
            plainProfileUrl: '',
            userId: 'others',
            connectionStatus: 'online',
            lastSeenAt: 0,
            metaData: {},
            isActive: true,
            friendDiscoveryKey: null,
            friendName: null,
            _preferredLanguages: null,
            requireAuth: false,
            state: 'joined',
            role: 'none',
            isMuted: false,
            isBlockedByMe: false,
            isBlockingMe: false,
            restrictionInfo: null,
        },
        {
            nickname: 'u1',
            plainProfileUrl: '',
            userId: 'test',
            connectionStatus: 'offline',
            lastSeenAt: 1686124306310,
            metaData: {},
            isActive: true,
            friendDiscoveryKey: null,
            friendName: null,
            _preferredLanguages: null,
            requireAuth: false,
            state: 'joined',
            role: 'none',
            isMuted: false,
            isBlockedByMe: false,
            isBlockingMe: false,
            restrictionInfo: null,
        },
    ],
    memberMap: {
        p2puser_CR_27_1686018659: {
            nickname: 'client CR90000181',
            plainProfileUrl: '',
            userId: 'p2puser_CR_27_1686018659',
            connectionStatus: 'online',
            lastSeenAt: 0,
            metaData: {},
            isActive: true,
            friendDiscoveryKey: null,
            friendName: null,
            _preferredLanguages: null,
            requireAuth: false,
            state: 'joined',
            role: 'none',
            isMuted: false,
            isBlockedByMe: false,
            isBlockingMe: false,
            restrictionInfo: null,
        },
        p2puser_CR_42_1686123922: {
            nickname: 'u1',
            plainProfileUrl: '',
            userId: 'p2puser_CR_42_1686123922',
            connectionStatus: 'offline',
            lastSeenAt: 1686124306310,
            metaData: {},
            isActive: true,
            friendDiscoveryKey: null,
            friendName: null,
            _preferredLanguages: null,
            requireAuth: false,
            state: 'joined',
            role: 'none',
            isMuted: false,
            isBlockedByMe: false,
            isBlockingMe: false,
            restrictionInfo: null,
        },
    },
    lastMessage: {
        messageId: 1859276692,
        messageType: 'user',
        channelUrl: 'p2porder_CR_28_1686124713',
        data: '1686124841614dadadadad1',
        customType: '',
        silent: false,
        createdAt: 1686124841808,
        updatedAt: 0,
        channelType: 'group',
        metaArrays: [],
        reactions: [],
        mentionType: 'users',
        mentionedUsers: [],
        sendingStatus: 'succeeded',
        parentMessageId: 0,
        parentMessageText: null,
        threadInfo: {
            replyCount: 0,
            mostRepliedUsers: [],
            lastRepliedAt: 0,
            updatedAt: 0,
        },
        isReplyToChannel: false,
        parentMessage: null,
        ogMetaData: null,
        isOperatorMessage: false,
        appleCriticalAlertOptions: null,
        message: 'dadadadada\ndaadadada\ndadadada\ndadadad',
        _sender: {
            nickname: 'client CR90000181',
            plainProfileUrl: '',
            userId: 'p2puser_CR_27_1686018659',
            connectionStatus: 'nonavailable',
            lastSeenAt: 0,
            metaData: {},
            isActive: true,
            friendDiscoveryKey: null,
            friendName: null,
            _preferredLanguages: null,
            requireAuth: false,
            role: 'none',
            isBlockedByMe: false,
        },
        reqId: '1686124828862',
        translations: {},
        requestState: 'succeeded',
        requestedMentionUserIds: [],
        errorCode: 0,
        messageSurvivalSeconds: -1,
        plugins: [],
        poll: null,
    },
    memberCount: 2,
    joinedMemberCount: 2,
    cachedDeliveryReceiptStatus: null,
    myPushTriggerOption: 'default',
    isHidden: false,
    hiddenState: 'unhidden',
    isDiscoverable: false,
    myLastRead: 1686124841808,
    messageSurvivalSeconds: -1,
    invitedAt: 1686124713911,
    joinedAt: 1686124713,
    _messageOffsetTimestamp: 0,
    _cachedLastDeliveredReceipt: {
        sentAt: 0,
        timeout: null,
    },
    isAccessCodeRequired: false,
    isPushEnabled: true,
    myCountPreference: 'all',
    unreadMentionCount: 0,
    myMemberState: 'joined',
    myRole: 'none',
    myMutedState: 'unmuted',
};

const mock_sendbird_store = {
    active_chat_channel: mock_channel,
    chat_info: {
        user_id: 'test_user_id',
    },
    chat_messages: [
        new ChatMessage({
            created_at: 3,
            channel_url: 'test',
            file_type: 'image/jpeg',
            id: 1,
            message: 'test message',
            message_type: 'user',
            name: 'test',
            sender_user_id: 'test',
            url: 'test',
            status: 2,
        }),
    ],
    initialiseChatWsConnection: jest.fn(),
    is_chat_loading: false,
    last_other_user_activity: 'Last seen 1 hour ago',
    onMessagesScroll: jest.fn(),
    setMessagesRef: jest.fn(),
    setShouldShowChatModal: jest.fn(),
    setShouldShowChatOnOrders: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: mock_order_store,
        sendbird_store: mock_sendbird_store,
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<Chat />', () => {
    it('should render loading state if chat is loading', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                is_chat_loading: true,
            },
        }));
        render(<Chat />);
        expect(screen.getByTestId('dt_chat_loading')).toBeInTheDocument();
    });

    it('should render one Chat components with  the info given', () => {
        render(<Chat />);
        expect(screen.getByTestId('dt_chat_loaded')).toBeInTheDocument();
        expect(screen.getByText('Test user')).toBeInTheDocument();
        expect(screen.getByText('test message')).toBeInTheDocument();
    });

    it('should render Chat components in mobile view', () => {
        (isMobile as jest.Mock).mockImplementationOnce(() => true);
        (isDesktop as jest.Mock).mockImplementationOnce(() => false);
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                should_show_chat_modal: true,
            },
        }));

        render(<Chat />);

        const mobile_ful_page_modal_return_header = screen.getByTestId('dt_mobile_full_page_modal_return_header');
        expect(mobile_ful_page_modal_return_header).toBeInTheDocument();
        userEvent.click(mobile_ful_page_modal_return_header);
        expect(mock_sendbird_store.setShouldShowChatModal).toHaveBeenCalledWith(false);
        expect(mock_sendbird_store.setShouldShowChatOnOrders).toHaveBeenCalledWith(false);
        expect(mock_order_store.hideDetails).toHaveBeenCalledWith(true);
    });

    it('should render error message and retry button if there is an error fetching messages', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                has_chat_error: true,
            },
        }));
        render(<Chat />);
        expect(screen.getByText('Oops, something went wrong')).toBeInTheDocument();
        const retry_button = screen.getByText('Retry');

        expect(retry_button).toBeInTheDocument();
        userEvent.click(retry_button);
        expect(mock_sendbird_store.initialiseChatWsConnection).toHaveBeenCalled();
    });
});
