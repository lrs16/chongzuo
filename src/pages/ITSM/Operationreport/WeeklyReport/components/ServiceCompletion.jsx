import React, { useEffect, useRef, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const ServiceCompletion = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    serviceCompletionlist,
    serviceCompletionsecondlist,
    serviceCompletionthreelist,
    id = { id }
  } = props;

  const column = [
    {
      title: '序号',
      dataIndex: '11',
      key: '11'
    },
    {
      title: '事件对象一级',
      dataIndex: '22',
      key: '22'
    },
    {
      title: '事件对象二级',
      dataIndex: '33',
      key: '33'
    },
    {
      title: '上周事件单数',
      dataIndex: '44',
      key: '44'
    },
    {
      title: '本周事件单数',
      dataIndex: '55',
      key: '55'
    },
    {
      title: '环比上周',
      dataIndex: '66',
      key: '66'
    },
  ];

  const secondlyColumn = [
    {
      title: '序号',
      dataIndex: 'aa',
      key: 'aa'
    },
    {
      title: '服务指标',
      dataIndex: 'bb',
      key: 'bb'
    },
    {
      title: '上周',
      dataIndex: 'cc',
      key: 'cc'
    },
    {
      title: '本周',
      dataIndex: 'dd',
      key: 'dd'
    },
    {
      title: '环比',
      dataIndex: 'ee',
      key: 'ee'
    },
    {
      title: '备注',
      dataIndex: 'ff',
      key: 'ff'
    },
  ];

  const threeColumn = [
    {
      title: '事件单受理数量',
      dataIndex: 'aa1',
      key: 'aa1'
    },
    {
      title: '一线处理量',
      dataIndex: 'bb1',
      key: 'bb1'
    },
    {
      title: '一线解决率',
      dataIndex: 'cc1',
      key: 'cc1'
    },
  ]

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
        </Col>

        <Col span={24}>
          <p>（一）运维分类统计情况 </p>
        </Col>

        {
          id !== 'add' && (
            <Table
              columns={column}
              dataSource={serviceCompletionlist}
            />
          )
        }

        <Form.Item style={{ marginTop: '20px' }} label=''>
          {
            getFieldDecorator('params8', {})
              (<TextArea />)
          }
        </Form.Item>

        <Col span={24}>
          <p>二、软件运维服务指标完成情况</p>
        </Col>

        <Table
          columns={secondlyColumn}
          dataSource={serviceCompletionsecondlist}
        />



        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>指标分析:</p>
        </Col>


        <Col span={24}>
          <p>1.一线问题解决情况汇总统计</p>
        </Col>

          <Table
            columns={threeColumn}
            dataSource={serviceCompletionthreelist}
          />


        <Col span={24}>
          <Form.Item label=''>
            {
              getFieldDecorator('params9', {})
                (<TextArea />)
            }
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            label='上传附件'
            {...forminladeLayout}
          >
            {getFieldDecorator('params11', {})
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

export default Form.create({})(ServiceCompletion)