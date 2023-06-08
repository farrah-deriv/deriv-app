import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessageText from '../chat-message-text';

describe('<ChatMessageText />', () => {
    it('should render component and its children with text color passed in the prop', () => {
        render(<ChatMessageText color='less-prominent'>test</ChatMessageText>);
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('test')).toHaveStyle('color: var(--text-less-prominent)');
    });
});
