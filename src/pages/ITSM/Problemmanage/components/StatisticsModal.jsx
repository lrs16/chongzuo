import React, { useState } from 'react';

import {
  Drawer
} from 'antd';

function StatisticsModal(props) {
  const {
    visible,
    title,
    handleCancel,
    modalParams
  } = props;
  console.log(modalParams,'modalParams')

  return (
    <>
    <Drawer
      title={title}
      visible={visible}
      width={720}
      centered='true'
      maskClosable='true'
      onClose={() => handleCancel()}
    >
      <p>fff</p>
    </Drawer>
    </>
  )
}
export default StatisticsModal;