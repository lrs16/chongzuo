import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Registratdes from './components/Registratdes';
import Checkdes from './components/Checkdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';

const { Panel } = Collapse;

// panel详情
const Panelheadermap = new Map([
  ['register', '事件登记'],
  ['handle', '事件处理'],
  ['check', '事件审核'],
  ['finish', '事件确认'],
]);

function EventDetails(props) {
  const { match, location, dispatch, info, loading } = props;
  const { main_id } = location.query;
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState([]);
  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/query`,
    });
  };

  const callback = key => {
    setActiveKey(key);
  };

  // 初始化打开
  useEffect(() => {
    dispatch({
      type: 'eventquery/fetchopenview',
      payload: {
        main_id,
      },
    });
  }, []);

  // 初始化值panel
  useEffect(() => {
    setActiveKey([1]);
  }, [info]);

  return (
    <PageHeaderWrapper title={pagetitle} extra={<Button onClick={handleclose}>返回</Button>}>
      <div className={styles.collapse}>
        {info !== '' && loading === false && (
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
          >
            {info.map((obj, index) => {
              // panel详情组件
              const Paneldesmap = new Map([
                ['register', <Registratdes info={Object.values(obj)[0]} main={info[0].main} />],
                ['handle', <Handledes info={Object.values(obj)[0]} main={info[0].main} />],
                ['check', <Checkdes info={Object.values(obj)[0]} main={info[0].main} />],
                ['finish', <ReturnVisitdes info={Object.values(obj)[0]} main={info[0].main} />],
              ]);

              if (index > 0)
                return (
                  <Panel Panel header={Panelheadermap.get(Object.keys(obj)[0])} key={index}>
                    {Paneldesmap.get(Object.keys(obj)[0])}
                  </Panel>
                );
            })}
          </Collapse>
        )}
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ eventquery, loading }) => ({
  info: eventquery.info,
  loading: loading.models.eventquery,
}))(EventDetails);
