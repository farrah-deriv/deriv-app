import React from 'react';
import { Text } from '@deriv/components';

type TSectionErrorProps = {
    className?: string;
    message: string;
    size?: string;
};

const SectionError: React.FC<TSectionErrorProps> = ({ className = 'section-error__form', message, size = 'xxs' }) => (
    <Text as='p' color='loss-danger' size={size} className={className}>
        {message}
    </Text>
);

export default SectionError;
