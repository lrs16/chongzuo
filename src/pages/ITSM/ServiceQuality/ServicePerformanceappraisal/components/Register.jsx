import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Row,
  Col,
  Select,
  AutoComplete,
  Spin
} from 'antd';
import SysUpload from '@/components/SysUpload';
import moment from 'moment';
import { operationPerson } from '@/services/common';
import { providerList, scoreListpage, contractProvider, clauseListpage } from '../../services/quality';
import SysDict from '@/components/SysDict';
import styles from '../index.less';

const { TextArea, Search } = Input;
const { Option } = Select;



const Register = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue, validateFields },
    formItemLayout,
    forminladeLayout,
    userinfo,
    register,
    getTarget1,
    getTarget2,
    target1,
    target2,
    getclausedetail,
    clauseList,
    taskData,
    contractArr,
    getContrractname,
    files,
    ChangeFiles,
    loading
  } = props;
  const [performanceLeader, setPerformanceLeader] = useState('')
  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [clauselist, setClauselist] = useState([]); // 详细条款
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [target1Type, setTarget1Type] = useState('功能开发'); //  设置指标类型
  const [target2Type, setTarget2Type] = useState('');
  const [spinloading, setSpinLoading] = useState(true);

  const required = true;

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  )

  const handleChange = (values,option,params) => {
    console.log('option: ', option);
    const { key,props: { value }} = option;
    switch (params) {
      case 'contract':
        setFieldsValue({
          contract: value,
          contractId: key
        })
        break;
      case 'target1Name':
        setFieldsValue({
          target1Name: value,
          target1Id: key
        })
        getTarget2(key);
        setTarget2Type(key)
        break;
      case 'target2Name':
        getclausedetail(key, scoreId);
        setFieldsValue({
          target2Name: value,
          target2Id:  key
        })
        break;
      case 'clause':
        setFieldsValue({
          clauseId: key
        })
        break;

      default:
        break;
    }
  }


  const handleFocus = (params) => {
    // if (!params) {
    //   if (loading !== true && target1 && target1.length === 0) {
    //     message.info('请选择评分细则名称哦！')
    //   }
    // }

    // if (params) {
    //   if (loading !== true && target2 && target2.length === 0) {
    //     message.info('请选择有效的一级指标哦！')
    //   }
    // }
    switch (params) {
      case 'contract':
        if (loading !== true && contractArr && contractArr.length === 0) {
          message.error('请选择有效的服务商')
        }
        break;
      case 'clause':
        if (loading !== true && clauseList && clauseList.length === 0) {
          message.error('请选择有效的二级指标')
        }
        break;

      default:
        break;
    }
  }

  // 自动完成服务商
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.providerNo}</span>
          <span>{opt.providerName}</span>
          <span>{opt.director}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 自动完成关联合同名称
  const contractNamedata = contractlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.contractNo}</span>
          <span>{opt.contractName}</span>
          <span>{opt.signTime}</span>
          <span>{opt.dueTime}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 自动完成评分细则
  const scorenameList = scorelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.scoreNo}</span>
          <span>{opt.scoreName}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 自动详细条款
  const clauseNamelist = clauselist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.scoreNo}</span>
          <span>{opt.scoreName}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 请求服务商
  const SearchDisableduser = (value, type) => {
    const requestData = {
      ...value,
      pageNum: 1,
      pageSize: 1000
    }
    switch (type) {
      case 'provider':
        providerList({ ...requestData }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setDisabledList(arr);
          }
        });
        break;
      case 'contract':
        if (!providerId) {
          message.error('请先选择服务商哦')
        } else {
          contractProvider(providerId).then(res => {
            if (res) {
              const arr = [...(res.data)];
              setSpinLoading(false);
              setContractlist(arr);
            }
          });
        }

        break;
      case 'score':
        scoreListpage({ ...requestData }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'clause':
        clauseListpage({ ...requestData, scoreId, targetId: target2Type, }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  // 选择服务商，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, providerName, scoreName, contractName, assessType, clauseName } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          provider: providerName,         // 服务商
          providerId: id,         // 服务商id
        });
        // contractProvider(id).then(res => {
        //   if (res.code === 200) {
        //     const arr = [...(res.data)];
        //     setSpinLoading(false);
        //     setContractlist(arr);
        //   }
        // });
        getContrractname(id)
        setProviderId(id);

        break;

      // case 'contract':
      //   setFieldsValue({
      //     contract: contractName,         // 合同名字
      //     contractId: id,         // 服务商id
      //   });
      //   break;

      case 'score':
        setFieldsValue({
          score: scoreName,      // 评分细则名称
          scoreId: id,         // 评分细则id
          assessType
        });
        setScoreId(id)
        getTarget1(assessType === '功能开发' ? '1' : '2')
        break;

      default:
        break;
    }
  };


  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
  }

  const selectOnchange = (value, option) => {
    setFieldsValue({
      directorName: value,
      directorId: option.key
    });
  }

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
    getPerformanceleader()
  }, [])

  // useEffect(() => {
  //   setFieldsValue({
  //     contract:register.contractId
  //   })

  // },[register])

  console.log(register.contractId, 'register.contractId')
  console.log(contractArr, 'contractArr')
  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid='1410413049587699713'
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='服务绩效编号'>
            {
              getFieldDecorator('assessNo', {
                initialValue: register.assessNo
              })
                (<Input disabled='true' />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='发生时间'>
            {
              getFieldDecorator('assessTime', {
                rules: [
                  {
                    required,
                    message: '请选择发生时间'
                  }
                ],
                initialValue: moment(register.assessTime)
              })
                (<DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='服务商'>
            {
              getFieldDecorator('provider', {
                rules: [
                  {
                    required,
                    message: '请输入服务商'
                  }
                ],
                initialValue: register.provider.providerName || register.provider
              })
                (
                  <AutoComplete
                    dataSource={disableduser}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 600 }}
                    onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
                  >
                    <Search
                      placeholder="可输入姓名搜索"
                      onSearch={values => SearchDisableduser(values, 'provider')}
                      allowClear
                    />
                  </AutoComplete>,
                )
            }
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label='服务商'>
            {
              getFieldDecorator('providerId', {
                rules: [
                  {
                    required,
                    message: '请输入服务商'
                  }
                ],
                initialValue: register.providerId
              })
                (
                  <Input />
                )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='关联合同名称'>
            {
              getFieldDecorator('contract', {
                rules: [
                  {
                    required,
                    message: '请输入关联合同名称'
                  }
                ],
                initialValue: register.contractId
              })
                (
                  <Select
                    // labelInValue='true'
                    placeholder='请选择'
                    allowClear
                    onChange={(value,option) => handleChange(value,option,'contract')}
                    onFocus={() => handleFocus('contract')}
                  >
                    {contractArr.map(obj => [
                      <Option key={obj.id} value={obj.contractName}>
                        <div className={styles.disableuser}>
                          <span>{obj.contractNo}</span>
                          <span>{obj.contractName}</span>
                        </div>
                      </Option>
                    ])}
                  </Select>

                )
            }
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label='关联合同名称'>
            {
              getFieldDecorator('contractId', {
                initialValue: register.contractId
              })
                (
                  <Input />
                )
            }
          </Form.Item>
        </Col>

        {performanceLeader && performanceLeader.length && (
          <Col span={8}>
            <Form.Item label='责任人'>
              {
                getFieldDecorator('directorName', {
                  rules: [
                    {
                      required,
                      message: '请输入责任人'
                    }
                  ],
                  initialValue: register.directorName
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
        )}


        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label='责任人id'>
            {
              getFieldDecorator('directorId', {
                initialValue: register.directorId
              })
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='评分细则名称'>
            {
              getFieldDecorator('score', {
                rules: [
                  {
                    required,
                    message: '请输入评分细则名称'
                  }
                ],
                initialValue: register.score.scoreName || register.score
              })
                (
                  <AutoComplete
                    dataSource={scorenameList}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 600 }}
                    onSelect={(v, opt) => handleDisableduser(v, opt, 'score')}
                  >
                    <Search
                      placeholder="可输入姓名搜索"
                      onSearch={values => SearchDisableduser(values, 'score')}
                      allowClear
                    />
                  </AutoComplete>,
                )
            }
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label='评分细则名称'>
            {
              getFieldDecorator('scoreId', {
                initialValue: register.scoreId
              })
                (
                  <AutoComplete
                    dataSource={scorenameList}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 600 }}
                    onSelect={(v, opt) => handleDisableduser(v, opt, 'score')}
                  >
                    <Search
                      placeholder="可输入姓名搜索"
                      onSearch={values => SearchDisableduser(values, 'score')}
                      allowClear
                    />
                  </AutoComplete>,
                )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='考核类型'>
            {
              getFieldDecorator('assessType', {
                initialValue: register.assessType
              })
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label='考核内容说明' {...forminladeLayout}>
            {
              getFieldDecorator('assessContent', {
                rules: [
                  {
                    required,
                    message: '请输入考核内容说明'
                  }
                ],
                initialValue: register.assessContent
              })
                (<TextArea
                  autoSize={{ minRows: 3 }}
                  placeholder='请控制字数在500字以内'
                  maxLength='500'
                />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='一级指标'>
            {
              getFieldDecorator('target1Name', {
                rules: [
                  {
                    required,
                    message: '请输入一级指标'
                  }
                ],
                initialValue: register.target1Id
              })
                (
                  <Select
                    labelInValue='true'
                    onChange={(value,option) => handleChange(value,option,'target1Name')}
                    onFocus={() => handleFocus()}
                    placeholder='请选择'
                    allowClear>
                    {(target1).map(obj => [
                      <Option key={obj.id} value={obj.id}>
                        {obj.title}
                      </Option>
                    ])}
                  </Select>
                )
            }
          </Form.Item>
        </Col>


        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label='一级指标id'>
            {
              getFieldDecorator('target1Id', {
                initialValue: register.target1Id
              })
                (
                  <Input />
                )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='二级指标'>
            {
              getFieldDecorator('target2Name', {
                rules: [
                  {
                    required,
                    message: '请输入二级指标'
                  }
                ],
                initialValue: register.target2Name
              })
                (
                  <Select
                    labelInValue='true'
                    onChange={(value,option) => handleChange(value,option,'target2Name')}
                    onFo cus={() => handleFocus('two')}
                    placeholder='请选择'
                    allowClear>
                    {(target2).map(obj => [
                      <Option key={obj.id} value={obj.id}>
                        {obj.title}
                      </Option>
                    ])}
                  </Select>
                )
            }
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label=' 二级指标'>
            {
              getFieldDecorator('target2Id', {
                initialValue: register.target2Id
              })
                (
                  <Input />
                )
            }
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label='详细条款' {...forminladeLayout}>
            {
              getFieldDecorator('clause', {
                rules: [
                  {
                    required,
                    message: '请输入详细条款'
                  }
                ],
                initialValue: register.clause === null ? '' : register.clause
              })
                (
                  <Select
                    labelInValue='true'
                    onChange={(value,option) => handleChange(value,option,'clause')}
                    onFocus={() => handleFocus('clause')}
                  >
                    {(clauseList.records || []).map(obj => [
                      <Option key={obj.id} value={obj.id}>
                        <div className={styles.disableuser}>
                          <span>{obj.orderNo}</span>
                          <span>{obj.detailed}</span>
                          <span>{obj.calc}</span>
                          <span>{obj.scoreValue}</span>
                          <span>{obj.sources}</span>
                        </div>
                      </Option>
                    ])}
                  </Select>
                )
            }
          </Form.Item>
        </Col>

        <Col span={24} style={{ display: 'none' }}>
          <Form.Item label='详细条款' {...forminladeLayout}>
            {
              getFieldDecorator('clauseId', {
                initialValue: register.clauseId
              })
                (<Input />)

            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='考核得分'>
            {
              getFieldDecorator('assessValue', {
                rules: [
                  {
                    required,
                    message: '请输入考核得分'
                  }
                ],
                initialValue: register.assessValue
              })
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='考核状态'>
            {
              getFieldDecorator('status', {
                initialValue: register.status
              })
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label='备注' {...forminladeLayout}>
            {
              getFieldDecorator('remark', {
                initialValue: register.remark
              })
                (<TextArea autoSize={{ minRows: 3 }} placeholder='请输入' />)
            }
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label='上传附件' {...forminladeLayout}>
            {
              getFieldDecorator('attachment', {})
                (<div style={{ width: 400 }}>
                  <SysUpload
                    fileslist={files}
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                  />
                </div>)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='登记人'>
            {
              getFieldDecorator('register', {
                initialValue: userinfo.userName
              })
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='登记时间'>
            {
              getFieldDecorator('applyTime', {
                initialValue: moment(register.applyTime)
              })
                (<DatePicker />)
            }
          </Form.Item>
        </Col>
      </Form>
    </Row>
  )
})

Register.defaultProps = {
  register: {
    assessNo: '',
    assessTime: new Date(),
    applyTime: new Date(),
    provider: '',
    providerId: '',
    target1Name: '',
    target2Name: '',
    clause: '',
    contract: '',
    contractId: '',
    directorName: '',
    directorId: '',
    score: '',
    scoreId: '',
    assessType: '',
    assessContent: '',
    target1Id: '',
    target2Id: '',
    clauseId: '',
    assessValue: '',
    status: '',
    remark: '',
    attachment: ''
  }
}

export default Form.create({})(Register)
