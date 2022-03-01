import React, { Component } from 'react';
import { Tag, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  state = {
    num: 0,
    pathname: '/',
    timeoutnum: []
  };

  componentDidMount() {
    this.getcount();
    this.getovertimenum();
    //  this.interval = setInterval(() => { this.getcount(); this.getovertimenum(); }, 30000);    // 打包到计量要放开
  }

  componentDidUpdate(newProps, _) {
    if (this.state.pathname !== newProps.pathname) {
      setTimeout(() => {
        this.setState({ pathname: newProps.pathname });
      });
      this.getcount();
      this.getovertimenum();
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

  getovertimenum() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchovertimenum',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          timeoutnum: res.data,
        });
      }
    });
  }

  changeReadState = clickedItem => {
    router.push({ pathname: `/ITSM/todo`, query: { pathpush: true, itemWorkType: clickedItem.type }, state: {} });
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
    const notices = this.state.timeoutnum;
    const typemap = new Map([
      ['event', '事件'],
      ['trouble', '故障'],
      ['problem', '问题'],
      ['demand', '需求'],
      ['release', '发布'],
      ['releaseBizTodo', '业务验证/复核'],
      ['operation', '作业计划'],
      ['work', '工作督办'],
      ['quality', '服务绩效'],
    ]);
    if (notices.length === 0) {
      return [];
    }
    const newNotices = notices.map(notice => {
      const newNotice = {
        key: notice.itemWorkType,
        title: `${typemap.get(notice.itemWorkType)}单`,
        description: notice.num,
        type: notice.itemWorkType,
        status: 'doing'
      };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
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
    return newNotices;
    //  return groupBy(newNotices, 'type');
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
    const { loading, onNoticeVisibleChange } = this.props;
    const noticeData = this.getNoticeData();
    // const unreadMsg = this.getUnreadData(noticeData);
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
        viewMoreText='查看全部待办单'
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => router.push({ pathname: `/ITSM/todo`, query: { pathpush: true, itemWorkType: 'all' }, state: { pageNum: 1, pageSize: 15, } })}
        clearClose
      >
        {/* 待办 */}
        <NoticeIcon.Tab
          tabKey="todo"
          title='待办'
          emptyText='你已完成所有待办'
          count={this.state.num}
          list={noticeData}
          showViewMore
        />
        {/* 通知 */}
        {/* <NoticeIcon.Tab
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
        /> */}
        {/* 消息 */}
        {/* <NoticeIcon.Tab
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
        /> */}
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  num: global.num,
  //  eventlist: global.eventlist,
  //  notices: global.notices,
  // fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  // fetchingNotices: loading.effects['global/fetchNotices'],
  loading: loading.models.global,
}))(GlobalHeaderRight);
