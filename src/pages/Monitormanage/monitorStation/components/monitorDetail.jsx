import React, { useState } from 'react';
import { Drawer, Radio } from 'antd';
import System from './system';
import Oracle from './oracle';

export default props => {
  const { visible, onClose } = props;
  const [show, setShow] = useState('system');

  return (
    <Drawer title="监测详情" width={1000} destroyOnClose="true" visible={visible} onClose={onClose}>
      <Radio.Group
        defaultValue="system"
        buttonStyle="solid"
        onChange={e => setShow(e.target.value)}
      >
        <Radio.Button value="system">System</Radio.Button>
        <Radio.Button value="oracle">Oracle</Radio.Button>
      </Radio.Group>

      {show === 'system' && <System />}
      {show === 'oracle' && <Oracle />}
    </Drawer>
  );
};
