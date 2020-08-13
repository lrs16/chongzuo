import React, { useState } from 'react';
import { Drawer, Radio, Card } from 'antd';
import System from './system';
import Oracle from './oracle';

export default props => {
  const { data, visible, onClose } = props;
  const [show, setShow] = useState('system');

  return (
    <Drawer title="监测详情" width={1200} destroyOnClose="true" visible={visible} onClose={onClose}>
      <Card>
        <Radio.Group
          defaultValue="system"
          buttonStyle="solid"
          onChange={e => setShow(e.target.value)}
        >
          <Radio.Button value="system">System</Radio.Button>
          <Radio.Button value="oracle">Oracle</Radio.Button>
        </Radio.Group>
      </Card>

      {show === 'system' && <System value={data} />}
      {show === 'oracle' && <Oracle value={data} />}
    </Drawer>
  );
};
