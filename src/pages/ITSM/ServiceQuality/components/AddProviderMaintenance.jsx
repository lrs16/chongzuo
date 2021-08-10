import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Input,
  Popconfirm,
  Divider,
  message,
  Radio,
  Select
} from 'antd';
import { operationPerson } from '@/services/common';
import { phone_reg } from '@/utils/Regexp';
import moment from 'moment';
import { connect } from 'dva';
import Contract from './Contract';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const { Option } = Select;


function AddProviderMaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    maintenanceData,
    location: { query: { id, providerStatus, providerSearch } },
    addProviderMaintenance,
    userinfo,
    searchProviderobj,
    contractProviderobj,
    dispatch,
    loading
  } = props;
  const [performanceLeader, setPerformanceLeader] = useState('')
  const required = true;

  const statueContent = ['在用','停用','过期'];

  console.log(providerStatus,'providerStatus')

  //  服务商详情页
  const providerDetail = () => {
    dispatch({
      type: 'qualityassessment/searchProvider',
      payload: id
    })
  }

  //  服务商绑定的合同
  const contractProviderdata = () => {
    dispatch({
      type: 'qualityassessment/contractProvider',
      payload: id
    })
  }

  //  添加&&更新合同
  const handleonSumit = (values) => {
    if (values.contractNo) {
      dispatch({
        type: 'qualityassessment/contractUpd',
        payload: {
          ...values,
          signTime: moment(values.signTime).format('YYYY-MM-DD HH:mm:ss'),
          dueTime: moment(values.dueTime).format('YYYY-MM-DD HH:mm:ss'),
          // id,
          providerId: id
        }
      }).then(res => {
        if (res.code === 200) {
          if (!providerSearch) {
            message.info(res.msg);
          }
          contractProviderdata()
        } else {
          message.error(res.msg)
        }
      })
    } else {
      dispatch({
        type: 'qualityassessment/contractAdd',
        payload: {
          ...values,
          signTime: moment(values.signTime).format('YYYY-MM-DD HH:mm:ss'),
          dueTime: moment(values.dueTime).format('YYYY-MM-DD HH:mm:ss'),
          providerId: id
        }
      }).then(res => {
        if (res.code === 200) {
          message.info(res.msg);
          contractProviderdata()
        } else {
          message.error(res.msg)
        }
      })
    }

  }

  //  删除合同
  const handleDelete = (contractId) => {
    return dispatch({
      type: 'qualityassessment/contractDel',
      payload: contractId
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        contractProviderdata()
      } else {
        message.error(res.msg)
      }

    })

  }

  const selectOnchange = (value, option) => {
    setFieldsValue({
      directorName: value,
      directorId: option.key
    });
  }

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo'
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '签订日期',
      dataIndex: 'signTime',
      key: 'signTime'
    },
    {
      title: '到期日期',
      dataIndex: 'dueTime',
      key: 'dueTime'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record) => {
        return <p>{statueContent[text]}</p>
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <span disabled={providerSearch}>
            <Contract
              contract={record}
              isEdit={providerSearch}
              title='编辑合同'
              formItemLayout={formItemLayout}
              onSumit={values => handleonSumit(values)}
            >
              <a>
                编辑合同
              </a>
            </Contract>
            <Divider type="vertical" />
            <Popconfirm
              title='是否要删除此行？'
              onConfirm={() => handleDelete(record.id)}
              disabled={providerSearch}
            >
              <a>删除合同</a>
            </Popconfirm>
          </span>
        )
      }
    },
  ]

  const getPerformanceleader = () => {
    operationPerson().then(res => {
      const result = (res.data).map(item => {
        return {
          key: item.id,
          value: item.userName
        }
      })
      setPerformanceLeader(result)
    })
  }

  useEffect(() => {
    if (id) {
      providerDetail();
      contractProviderdata();
    } else {
      dispatch({
        type: 'qualityassessment/clearProviderdata'
      });
    }
    getPerformanceleader();
  }, [id])

  console.log(searchProviderobj, 'searchProviderobj')

  const handleBack = () => {
    if (providerSearch) {
      router.push({
        pathname: `/ITSM/servicequalityassessment/serviceprovidersearch`,
      })
    } else {
      router.push({
        pathname: `/ITSM/servicequalityassessment/serviceprovidermaintenance`,
      })
    }

  }

  const handleSaveForm = () => {
    if (id) {
      validateFields((err, value) => {
        return dispatch({
          type: 'qualityassessment/providerUpd',
          payload: {
            ...value,
            id
          },
        }).then(res => {
          if (res.code === 200) {
            message.info(res.msg);
            providerDetail()
          } else {
            message.error(res.msg)
          }
        })
      })
    } else {
      validateFields((err, value) => {
        if (!err) {
          dispatch({
            type: 'qualityassessment/providerAdd',
            payload: value
          })
        }
      })
    }
  }

  return (
    <PageHeaderWrapper
      title={id ? '服务商维护详情' : pagetitle}
      extra={
        <>
          <Button type='primary' onClick={handleSaveForm}>保存</Button>


          <Button onClick={handleBack}>返回</Button>
        </>
      }
    >
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='服务商编号'>
                {getFieldDecorator('providerNo', {
                  initialValue: searchProviderobj.providerNo
                })
                  (<Input disabled='true' />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='服务商名称'>
                {getFieldDecorator('providerName', {
                  rules: [
                    {
                      required,
                      message: '请输入服务商名称'
                    }
                  ],
                  initialValue: searchProviderobj.providerName
                })
                  (<Input disabled={providerSearch} />)
                }
              </Form.Item>
            </Col>

            {/* {performanceLeader && performanceLeader.length && (
              <Col span={8}>
                <Form.Item label='负责人'>
                  {
                    getFieldDecorator('directorName', {
                      rules: [
                        {
                          required,
                          message: '请输入责任人'
                        }
                      ],
                      initialValue: searchProviderobj.director
                    })
                      (
                        <Select onChange={selectOnchange} >
                          {performanceLeader.map(obj => [
                            <Option key={obj.key} value={obj.value}>
                              {obj.value}
                            </Option>
                          ])}

                        </Select>
                      )
                  }
                </Form.Item>
              </Col>
            )} */}
            
            <Col span={8}>
              <Form.Item label='负责人'>
                {getFieldDecorator('director', {
                  rules: [
                    {
                      required,
                      message: '请输入负责人'
                    }
                  ],
                  initialValue: searchProviderobj.director
                })
                  (<Input disabled={providerSearch} />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='负责人手机号'>
                {getFieldDecorator('directorPhone', {
                  rules: [
                    {
                      required,
                      len: 11,
                      validator: phone_reg,
                      message: '请输入正确的手机号'
                    }
                  ],
                  initialValue: searchProviderobj.directorPhone
                })
                  (<Input disabled={providerSearch} />)
                }
              </Form.Item>
            </Col>

            {
              providerStatus === '1' && (
                <Col span={8}>
                  <Form.Item label='状态'>
                    {
                      getFieldDecorator('status', {
                        initialValue: searchProviderobj.status
                      })(
                        <Radio.Group disabled={providerSearch}>
                          <Radio value='1'>启用</Radio>
                          <Radio value='0'>禁用</Radio>
                        </Radio.Group>
                      )
                    }
                  </Form.Item>
                </Col>
              )
            }

          </Form>
        </Row>

        {
          id && !providerSearch && (
            <Contract
              title='新增合同'
              formItemLayout={formItemLayout}
              onSumit={values => handleonSumit(values)}
            >
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                icon='plus'
              >
                添加合同
              </Button>
            </Contract>
          )
        }


        {
          loading === false && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={contractProviderobj}
            />
          )
        }

      </Card>
    </PageHeaderWrapper>
  )
}

AddProviderMaintenance.defaultProps = {
  searchProviderobj: {
    providerNo: '',
    providerName: '',
    director: '',
    directorPhone: '',
    status: ''
  }
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    searchProviderobj: qualityassessment.searchProviderobj,
    contractProviderobj: qualityassessment.contractProviderobj,
    loading: loading.models.qualityassessment
  }))(AddProviderMaintenance)
)
