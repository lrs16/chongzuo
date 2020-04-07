import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Avatar } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ScenesDrawer from './components/ScenesDrawer';

import styles from './OpsScene.less';

@connect(({ secenelist, loading }) => ({
  secenelist,
  loading: loading.models.secenelist,
}))
class CardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'secenelist/fetch',
      payload: {
        count: 11,
      },
    });
  }

  render() {
    const {
      secenelist: { list },
      loading,
    } = this.props;


    return (
      <PageHeaderWrapper title="运维场景">
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[<a>在执行数：50</a>, <a>已停止数：2</a>]}>
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
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
