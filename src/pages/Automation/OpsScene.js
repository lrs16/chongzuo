import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Card, Divider, Icon, List, Message, Button } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import ScenesDrawer from './components/ScenesDrawer';   //打开新建场景抽屉
import ReportModal from './components/ReportModal';

import styles from './OpsScene.less';

@connect(({ opsscenes, loading }) => ({
  opsscenes,
  loading: loading.models.opsscenes,
}))
class CardList extends PureComponent {
  state = {
    reportdata: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opsscenes/fetch',
      payload: { limit: 100, pages: 0 },
    });
  }

  render() {
    const fetchreportlist = id => {
      const { dispatch } = this.props;
      dispatch({
        type: 'opsscenes/fetchscript',
        payload: { id },
      }).then(() => {
        this.setState({
          reportdata: this.props.opsscenes.scriptlist,
        });
      });
    };
    const execuSecene = scenarioId => {
      const { dispatch } = this.props;
      dispatch({
        type: 'opsscenes/execution',
        payload: { scenarioId },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
        } else {
          Message.error('执行失败！');
        }
      });
    };

    const {
      opsscenes: { list },
      loading,
    } = this.props;
    const dataSource = [...list];
    const reportlist = this.state.reportdata;
    return (
      <PageHeaderWrapper title="运维场景">
        <div className={styles.cardList}>
          {/* <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[<a href="/automation/workflow">作业编排：50</a>, <a>立即执行</a>, <a>查看报告</a>]}>
                    <Card.Meta
                      // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      avatar={<Icon type={item.sceneicon} className={styles.cardAvatar} />}
                      title={<a>{item.scenedetitle}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.scenede}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <ScenesDrawer>
                    <Button type="dashed" className={styles.newButton}>
                      <Icon type="plus" /> 新建场景
                    </Button>
                  </ScenesDrawer>
                </List.Item>
              )
            }
          /> */}
          <List
            // rowKey="scenarioId"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={dataSource}
            renderItem={item => (
              <List.Item key={item.scenarioId}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={[
                    <Link
                      to={{
                        pathname: '/automation/opsscene/workflow',
                        state: {
                          scenarioId: item.scenarioId,
                          scenarioName: item.scenarioName,
                        },
                      }}
                    >
                      脚本编排：{item.size}
                    </Link>,
                    <a onClick={() => execuSecene(item.scenarioId)}>立即执行</a>,
                    <ReportModal
                      sceneid={item.scenarioId}
                      scenemane={item.scenarioName}
                      datas={reportlist}
                      fetchReport={() => {
                        fetchreportlist(item.scenarioId);
                      }}
                    >
                      <a type="link">查看报告</a>
                    </ReportModal>,
                  ]}
                >
                  <Card.Meta
                    // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    avatar={<Icon type={item.sceneicon} className={styles.cardAvatar} />}
                    title={<a>{item.scenarioName}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.scenarioDesc}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
