import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
} from 'antd';
import Problemexcel from './components/Problemexcel';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    dispatch,
    besolveList,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text, record, index) =>
    //     `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    // },
    {
      title: '问题编号',
      dataIndex: 'no',
      key: 'no',
      render: (text, record) => (
        <Link
          to={{
            pathname: `/ITSM/problemmanage/besolveddetail/workorder/${record.id}`,
            paneKey: record.status, // 传状态
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '问题标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '问题来源',
      dataIndex: 'sourcecn',
      key: 'sourcecn',
    },
    {
      title: '问题分类',
      dataIndex: 'typecn',
      key: 'typecn',
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentNode',
      key: 'currentNode',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '重要程度',
      dataIndex: 'importancecn',
      key: 'importancecn',
    },
  ];

  const getTobolist = () => {
    dispatch({
      type: 'problemmanage/besolveList',
      payload: {
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      getTobolist();
    }
  }, [files]);

  useEffect(() => {
    getTobolist();
  }, []);

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'problemmanage/searchBesolve',
      payload: {
        ...values,
        pageSize,
        pageNum: page,
      },
    });
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: besolveList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = values;
      if (values.registerTime) {
        obj.registerTime = (values.registerTime).format('YYYY-MM-DD HH:mm:ss');
      }
      searchdata(obj, paginations.current, paginations.pageSize);
    });
  };

  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/besolvedownload',
          payload: { ...values }
        }).then(res => {
          const filename = `下载.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
    })
  }

  const exportDownload = () => {
    dispatch({
      type: 'problemmanage/exportdownloadExcel',
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const problemSource = getTypebyTitle('问题来源');
  const priority = getTypebyTitle('严重程度');
  const currentNode = getTypebyTitle('当前处理环节');
  const problemType = getTypebyTitle('问题分类');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1354287742015508481"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="问题编号">
                {getFieldDecorator('no', {
                  rules: [
                    {
                      message: '请输入问题编号',
                    },
                  ],
                })(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('currentNode', {
                  rules: [
                    {
                      message: '请输入处理环节',
                    },
                  ],
                })(
                  <Select placeholder="请选择" allowClear>
                    {currentNode.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题标题" >
                    {getFieldDecorator('title', {})(<Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题来源">
                    {getFieldDecorator('source', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {problemSource.map(obj => [
                            <Option key={obj.key} value={obj.dict_code}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="问题分类">
                    {getFieldDecorator('type', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {problemType.map(obj => [
                            <Option key={obj.key} value={obj.dict_code}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">{getFieldDecorator('registerUser', {})(<Input placeholder='请输入' allowClear />)}</Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('registerTime', {
                    })
                      (<DatePicker allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="重要程度">
                    {getFieldDecorator('importance', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {priority.map(obj => [
                            <Option key={obj.key} value={obj.dict_code}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === false && (
              <Col span={8}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>

                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>

                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}

            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>

        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'row' }} >
          <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
            导入下载模板
          </Button>

          {
            loading === false && (
              <div>
                <Problemexcel
                  fileslist={[]}
                  ChangeFileslist={newvalue => setFiles(newvalue)}
                />
              </div>
            )

          }


          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => download()}
          >
            导出数据
        </Button>
        </div>



        <Table
          loading={loading}
          columns={columns}
          dataSource={besolveList.rows}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    besolveList: problemmanage.besolveList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
