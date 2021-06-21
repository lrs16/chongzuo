import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm,
  Select,
  message
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;
function InspectionSummary(props) {

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    materialsList,
    materialsArr,
    reportSearch
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      materialsList(data)
    }
  }, [data]);

  const handleSave = () => {
    materialsList(data);
    message.info('暂存保存数据成功')
  }

  // 新增一条记录
  const newMember = (params) => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
    });
    setData(newData);
    setNewButton(true);
  };


  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    setData(target)
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }



  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    if (newbutton === false) {
      const newarr = materialsArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '材料名称',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '是否提交',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field2', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => remove(record.key)}
              disabled={reportSearch}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
        // }
      }

    }

  ];

  useEffect(() => {
    handleTabledata();
  }, [materialsArr])


  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p>(2)运维材料提交情况</p>
        </Col>

        <Col>
          <Button
            disabled={reportSearch}
            type='primary'
            onClick={handleSave}>保存</Button>
        </Col>

        <Table
          columns={column}
          dataSource={data}
          pagination={false}
        />

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="primary"
          ghost
          onClick={() => newMember()}
          icon="plus"
          disabled={reportSearch}
        >
          新增
        </Button>
      </Row>
    </>
  )
}

export default Form.create({})(InspectionSummary)
