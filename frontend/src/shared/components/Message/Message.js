import React from 'react';
import { string } from 'prop-types';

import './Message.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Message = ({
  type,
  content,
}) => (
  <div className={`message message-${type}`}>
    {content}
  </div>
);

Message.propTypes = {
  type: string.isRequired,
  content: string.isRequired,
};

export default Message;
