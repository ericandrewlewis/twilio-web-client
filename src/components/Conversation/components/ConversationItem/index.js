import React, { Component } from 'react';
import style from './style.css';
import classNames from 'classnames';

export default class ConversationItem extends Component {
  render() {
    const { message } = this.props;
    const classes = classNames(
      style.conversationItem,
      {
        [style.statusSending]: message.status === 'sending',
        [style.statusSent]: message.status === 'sent'
    });
    const wrapperClasses = classNames({
      [style.fromSelf]: message.from === 'self',
      [style.fromOther]: message.from !== 'self'
    });
    return (
      <div className={wrapperClasses}>
        <div className={classes}>{this.props.message.content}</div>
      </div>
    );
  }
}
