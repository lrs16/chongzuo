import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Registratdes from './components/Registratdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';

const { Panel } = Collapse;

const Collapsekeymap = new Map([
  [0, 'registratdes'],
  [1, 'registratdes'],
  [2, 'registratdes'],
  [3, 'handledes'],
  [4, 'handledes'],
  [5, 'visitdes'],
  [6, 'handledes'],
  [7, 'visitdes'],
]);

function EventDetails(props) {
  const { match, location } = props;
  const { pangekey, id } = location.query;
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

  useEffect(() => {
    setActiveKey([`${Collapsekeymap.get(pangekey)}`]);
  }, []);

  return (
    <PageHeaderWrapper title={pagetitle} extra={<Button onClick={handleclose}>返回</Button>}>
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >
          {pangekey !== 0 && (
            <Panel header="事件登记" key="registratdes">
              <Registratdes />
            </Panel>
          )}
          {(pangekey !== 0 || pangekey !== 1 || pangekey !== 2) && (
            <Panel header="事件处理" key="handledes">
              <Handledes />
            </Panel>
          )}
          {(pangekey === 5 || pangekey === 6 || pangekey === 7) && (
            <Panel header="事件回访" key="visitdes">
              <ReturnVisitdes />
            </Panel>
          )}
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default EventDetails;
