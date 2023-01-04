import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { knowledgesaveByOrder } from '@/services/api';

function KnowledgCollect(props) {
  const { valuealready, content, orderType, orderId, ChangeValuealready, HandleGEtContent } = props;

  const handleClick = () => {
    HandleGEtContent()
  }
  useEffect(() => {
    if (valuealready) {
      const value = {
        content, orderType, orderId
      }
      if (content && orderType && orderId) {
        knowledgesaveByOrder(value).then(res => {
          if (res.code === 200) {
            message.success('知识收入成功')
          } else {
            message.error(res.msg)
          }
        });
      } else {
        message.error('请先输入信息')
      }
      ChangeValuealready(false)
    }
  }, [valuealready])
  return (
    <div style={{ paddingLeft: 4, paddingBottom: 6 }}>
      <Button onClick={() => handleClick()} type='primary'>
        <PlusSquareOutlined />  知识收录
      </Button>
    </div>
  );
}

export default KnowledgCollect;