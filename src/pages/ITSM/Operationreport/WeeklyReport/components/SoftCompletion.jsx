import React, { useEffect,useRef, useImperativeHandle} from 'react';
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

const SoftCompletion = React.forwardRef((props,ref) => {
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
    softCompletionlist,
    completionsecondTablelist
  } = props;

  const column = [
    {
      title: '日期',
      dataIndex: 'ww11',
      key: 'ww11'
    },
    {
      title: '工作项',
      dataIndex: 'ww22',
      key: 'ww22'
    },
    {
      title: '工作内容',
      dataIndex: 'ww33',
      key: 'ww33'
    },
    {
      title: '完成情况',
      dataIndex: 'ww44',
      key: 'ww44'
    },
  ];

  const secondlyColumn = [
    {
      title: '序号',
      dataIndex: 'num1',
      key: 'num1'
    },
    {
      title: '材料名称',
      dataIndex: 'num2',
      key: 'num2'
    },
    {
      title: '是否提交',
      dataIndex: 'num3',
      key: 'num3'
    },
  ];


  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>五、软件作业完成情况</p>
        </Col>

        <Col span={20}>
          <Form.Item style={{ marginTop: '20px' }} label=''>
            {
              getFieldDecorator('params33', {})
                (<TextArea />)
            }
          </Form.Item>
        </Col>

        <Col span={20}>
          <p>(1)数据库本周进行了补丁升级工作次：</p>
        </Col>

        <Col span={20}>
          <Table
            columns={column}
            dataSource={softCompletionlist}
          />
        </Col>

        <Col span={20}>
          <p>(2)计划2021年月日至2021年月日,计量自动化系统开展次发布变更（消缺），变更内容如下:</p>
        </Col>

        <Col span={20}>
          <Table
            columns={secondlyColumn}
            dataSource={completionsecondTablelist}
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


export default Form.create({})(SoftCompletion)
