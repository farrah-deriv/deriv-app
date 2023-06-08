import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatFooterIcon from '../chat-footer-icon';

describe('<ChatFooterIcon />', () => {
    it("should render 'IcAttachment' icon if should_show_attachment_icon prop is true", () => {
        render(<ChatFooterIcon should_show_attachment_icon />);
        expect(screen.getByTestId('dt_attachment_icon')).toBeInTheDocument();
    });
    it("should render 'IcSendMessage' icon if should_show_attachment_icon prop is false", () => {
        render(<ChatFooterIcon should_show_attachment_icon={false} />);
        expect(screen.getByTestId('dt_send_message_icon')).toBeInTheDocument();
    });
});
