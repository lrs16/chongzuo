import React, { useEffect, useRef, useImperativeHandle } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row
} from 'antd';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const ThisWeekitsm = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  )

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    thisWeekitsmlist
  } = props;

  const column = [
    {
      title: '序号',
      dataIndex: 'a11',
      key: 'a11'
    },
    {
      title: '工单类型',
      dataIndex: 'a22',
      key: 'a22'
    },
    {
      title: '事件对象二级',
      dataIndex: 'a33',
      key: 'a33'
    },
    {
      title: '上周事件单数',
      dataIndex: 'a44',
      key: 'a44'
    },
    {
      title: '本周事件单数',
      dataIndex: 'a55',
      key: 'a55'
    },
    {
      title: '环比上周',
      dataIndex: 'a66',
      key: 'a66'
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>四、本周事件、问题及故障</p>
        </Col>

        <Col span={20}>
          <Table
            columns={column}
            dataSource={thisWeekitsmlist}
          />
        </Col>

        <Col span={6}>
          <Form.Item
            label='上传附件'
            {...forminladeLayout}
          >
            {getFieldDecorator('params22', {})
              (
                <div style={{ width: 400 }}>
                  <SysUpload
                    fileslist={[]}
                    // ChangeFileslist={newvalue => setFiles(newvalue)}
                  />
                </div>
              )}

          </Form.Item>
        </Col>
      </Row>

    </>
  )
})

export default Form.create({})(ThisWeekitsm)