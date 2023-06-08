import React, { useRef } from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { useStores } from 'Stores/index';
import ChatMessage from 'Utils/chat-message';
import ChatMessages from '../chat-messages';

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
    chat_messages: [] as ChatMessage[],
    onMessagesScroll: jest.fn(),
    setMessagesRef: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        sendbird_store: mock_sendbird_store,
    })),
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(() => ({
        current: {
            scrollTop: 0,
            scrollHeight: 100,
        },
    })),
}));

describe('<ChatMessages />', () => {
    it('should render the component with data-testid `dt_blank_chat_messages`, but without any messages', () => {
        render(<ChatMessages />);
        expect(screen.getByTestId('dt_blank_chat_messages')).toHaveClass('chat-messages');
    });

    it('should render the component with data-testid `dt_themed_scrollbars` and with messages', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [
                    new ChatMessage({
                        created_at: 3,
                        channel_url: 'test',
                        file_type: 'image/jpeg',
                        id: 1,
                        message: 'test',
                        message_type: 'user',
                        name: 'test',
                        sender_user_id: 'test',
                        url: 'test',
                        status: 2,
                    }),
                ],
            },
        }));
        render(<ChatMessages />);
        expect(screen.getByTestId('dt_themed_scrollbars')).toHaveClass('chat-messages');
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('should render appropriate styles and statuses if message is from the current user', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [
                    new ChatMessage({
                        created_at: 3,
                        channel_url: 'test',
                        file_type: 'image/jpeg',
                        id: 1,
                        message: 'test',
                        message_type: 'user',
                        name: 'test',
                        sender_user_id: 'test_user_id',
                        url: 'test',
                        status: 2,
                    }),
                ],
            },
        }));

        render(<ChatMessages />);
        expect(screen.getByTestId('dt_chat_messages_item')).toHaveClass('chat-messages-item--outgoing');
        expect(screen.getByText('test')).toHaveStyle('--text-color: var(--text-colored-background)');
    });

    it('should render image and adjust scroll position if the message type is file', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [
                    new ChatMessage({
                        created_at: 3,
                        channel_url: 'test',
                        file_type: 'image/jpeg',
                        id: 1,
                        message: 'test',
                        message_type: 'file',
                        name: 'test',
                        sender_user_id: 'test',
                        url: 'test',
                        status: 2,
                    }),
                ],
            },
        }));

        const scrollRef = useRef<(HTMLDivElement & SVGSVGElement) | null>();

        render(<ChatMessages />);
        const image = screen.getByRole('img');
        fireEvent.load(image);
        expect(scrollRef.current).not.toBeNull();
        expect(scrollRef.current?.scrollTop).toBe(0);
    });

    it('should call onMessagesScroll when scrolling the messages', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [
                    new ChatMessage({
                        created_at: 3,
                        channel_url: 'test',
                        file_type: 'image/jpeg',
                        id: 1,
                        message: 'test',
                        message_type: 'user',
                        name: 'test',
                        sender_user_id: 'test_user_id',
                        url: 'test',
                        status: 2,
                    }),
                ],
            },
        }));

        render(<ChatMessages />);
        fireEvent.scroll(screen.getByTestId('dt_themed_scrollbars'));
        expect(mock_sendbird_store.onMessagesScroll).toHaveBeenCalled();
    });
});
