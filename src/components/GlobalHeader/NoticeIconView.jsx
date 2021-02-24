import React, { Component } from 'react';
import { Tag, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  state = {
    num: 0,
    pathname: '/',
  };

  componentDidMount() {
    this.interval = setInterval(() => this.getcount(), 60000);
    this.getdata();
  }

  componentDidUpdate(newProps, _) {
    if (this.state.pathname !== newProps.pathname) {
      setTimeout(() => {
        this.setState({ pathname: newProps.pathname });
      });
      this.getcount();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  getcount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchCount',
    }).then(res => {
      this.setState({
        num: res.data,
      });
    });
  }

  getdata() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchNotices',
    });
    dispatch({
      type: 'global/fetchallevent',
      payload: {
        handleUserName: 'elin',
        pageNum: 1,
        pageSize: 200,
      },
    });
  }

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title, key) => {
    const { dispatch } = this.props;
    message.success(
      `${formatMessage({
        id: 'component.noticeIcon.cleared',
      })} ${title}`,
    );

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = () => {
    const { notices = [] } = this.props;

    if (notices.length === 0) {
      return {};
    }

    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { currentUser, loading, onNoticeVisibleChange, eventlist } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    return (
      <NoticeIcon
        className={styles.action}
        count={this.state.num}
        onItemClick={item => {
          this.changeReadState(item);
        }}
        loading={loading}
        clearText={formatMessage({
          id: 'component.noticeIcon.clear',
        })}
        viewMoreText={formatMessage({
          id: 'component.noticeIcon.view-more',
        })}
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => message.info('Click on view more')}
        clearClose
      >
        {/* 待办 */}
        <NoticeIcon.Tab
          tabKey="event"
          title={formatMessage({
            id: 'component.globalHeader.event',
          })}
          emptyText={formatMessage({
            id: 'component.globalHeader.event.empty',
          })}
          count={this.state.num}
          list={noticeData.event}
          showViewMore
        />
        {/* 通知 */}
        <NoticeIcon.Tab
          tabKey="notification"
          // count={unreadMsg.notification}
          // list={noticeData.notification}
          title={formatMessage({
            id: 'component.globalHeader.notification',
          })}
          emptyText={formatMessage({
            id: 'component.globalHeader.notification.empty',
          })}
          showViewMore
        />
        {/* 消息 */}
        <NoticeIcon.Tab
          tabKey="message"
          // count={unreadMsg.message}
          // list={noticeData.message}
          title={formatMessage({
            id: 'component.globalHeader.message',
          })}
          emptyText={formatMessage({
            id: 'component.globalHeader.message.empty',
          })}
          showViewMore
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  num: global.num,
  eventlist: global.eventlist,
  notices: global.notices,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  loading: loading.models.global,
}))(GlobalHeaderRight);
