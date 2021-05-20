import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const LastweekHomework = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    []
  )

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    lastweekHomeworklist
  } = props;

  const column = [
    {
      title: '序号',
      dataIndex: 'yy11',
      key: 'yy11'
    },
    {
      title: '作业日期',
      dataIndex: 'yy22',
      key: 'yy22'
    },
    {
      title: '作业性质',
      dataIndex: 'yy33',
      key: 'yy33'
    },
    {
      title: '作业对象',
      dataIndex: 'yy44',
      key: 'yy44'
    },
    {
      title: '作业内容',
      dataIndex: 'yy55',
      key: 'yy55'
    },
    {
      title: '作业对象',
      dataIndex: 'yy66',
      key: 'yy66'
    },
    {
      title: '完成进度',
      dataIndex: 'yy77',
      key: 'yy77'
    },
    {
      title: '作业负责人',
      dataIndex: 'yy88',
      key: 'yy88'
    },
    {
      title: '作业单位',
      dataIndex: 'yy99',
      key: 'yy99'
    },
    {
      title: '备注',
      dataIndex: 'yy00',
      key: 'yy00'
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>七、上周作业完成情况</p>
        </Col>

        <Table
          columns={column}
          dataSource={lastweekHomeworklist}
        />

        <Col span={6}>
          <Form.Item
            label='上传附件'
            {...forminladeLayout}
          >
            {getFieldDecorator('params55', {})
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

export default Form.create({})(LastweekHomework)