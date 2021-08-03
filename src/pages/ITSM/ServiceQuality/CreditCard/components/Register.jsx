import React, { useImperativeHandle, useRef } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import MergeTable from '@/components/MergeTable';
const Register = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    tableSource
  } = props;


  const attRef = useRef();

  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    [],
  );

  const columns = [
    {
      title: '问题对象',
      dataIndex: 'first_object',
      key: 'first_object',
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = record.rowSpan;
        return obj;
      },
    },
    {
      title: '问题分类',
      dataIndex: 'second_object',
      key: 'second_object',
      align: 'center',
      render: (text, record) => {
        if (record.second_object === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }
        return <span>{text}</span>
      }
    },
    {
      title: '上周',
      dataIndex: 'last_num',
      key: 'last_num',
      align: 'center',
    },
    {
      title: '本周',
      dataIndex: 'now_num',
      key: 'now_num',
      align: 'center',
    },
    {
      title: '环比',
      dataIndex: 'points_count',
      key: 'points_count',
      align: 'center',
      render: (text, record) => {
        if (record.second_object === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }
        return <span>{text}</span>
      }
    },
  ];

  return (
    <>
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        {/* <Row> */}
        {/* <Col span={8}> */}
        <Col span={8}>
          <Form.Item label='计分卡编号'>
            {
              getFieldDecorator('name', {})
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="问题编号">
            {getFieldDecorator('no', {
              rules: [
                {
                  message: '请输入问题编号',
                },
              ],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='评价计分卡名称'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='评分细则名称'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>

        </Col>

        <Col span={8}>
          <Form.Item label='考核类型'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>

        </Col>

        <Col span={8}>
          <Form.Item label='版本号'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>

        </Col>

        <Col span={8}>
          <Form.Item label='专业部门'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>

        </Col>

        <Col span={8}>
          <Form.Item label='评价区间'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>

        </Col>

        <Col span={8}>
          <Form.Item label='服务商'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>

        </Col>

        <Col span={8}>
          <Form.Item label='合同名称'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='评价详情'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>

      </Form>

   
    </Row>

       <MergeTable
        column={columns}
        tableSource={tableSource}
        mergecell='first_object'
      />
    </>
  )
})

export default Form.create({})(Register)