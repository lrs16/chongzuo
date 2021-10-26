import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  message,
  DatePicker,
  Row,
  Col,
  Select,
  AutoComplete,
  Spin,
} from 'antd';
import SysUpload from '@/components/SysUpload';
import moment from 'moment';
import { operationPerson, searchUsers } from '@/services/common';
import SysDict from '@/components/SysDict';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import {
  providerList,
  scoreListpage,
  contractProvider,
} from '../../services/quality';
import styles from '../index.less';


const { TextArea, Search } = Input;
const { Option } = Select;

const Register = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue, getFieldsValue },
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
    contractArr,
    getContrractname,
    files,
    ChangeFiles,
    noEdit,
    loading,
  } = props;

  const [performanceLeader, setPerformanceLeader] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [directorlist, setDirectorlist] = useState([]); // 详细条款
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
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
  );

  const handleChange = (values, option, params) => {
    const {
      key,
      props: { value },
    } = option;
    switch (params) {
      case 'contract':
        setFieldsValue({
          contractName: key,
          contractId: value,
        });
        break;
      case 'target1Name':
        setFieldsValue({
          target1Name: value,
          target1Id: key,
          target2Name: '',
          target2Id: '',
          clauseName: '',
        });
        getTarget2(key);
        setTarget2Type(key);
        break;
      case 'target2Name':
        getclausedetail(key, scoreId);
        setFieldsValue({
          target2Name: value,
          target2Id: key,
          clauseId: '',
          clauseName: '',
        });
        break;
      case 'clause': {
        const {
          props: {
            children: {
              props: { children },
            },
          },
        } = option;
        setFieldsValue({
          clauseId: value,
          clauseName: children[4].props.children,
          assessValue: children[3].props.children,
        });
        break;
      }
      default:
        break;
    }
  };

  const handleFocus = params => {
    switch (params) {
      case 'one':
        if (loading !== true && target1 && target1.length === 0) {
          message.error('请选择有效的评分细则名称');
        }
        break;
      case 'two':
        if (loading !== true && target2 && target2.length === 0) {
          message.error('请选择有效的一级指标');
        }
        break;
      case 'contract':
        if (loading !== true && contractArr && contractArr.length === 0) {
          message.error('请选择有效的服务商');
        }
        break;
      case 'clause':
        if (loading !== true && clauseList && clauseList.length === 0) {
          message.error('请选择有效的二级指标');
        }
        break;

      default:
        break;
    }
  };

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

  // 自动完成责任人
  const directoruser = directorlist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.userName}</span>
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

  // 请求服务商
  const SearchDisableduser = (value, type) => {
    const requestData = {
      providerName: value,
      pageNum: 1,
      pageSize: 1000,
      status: '1',
    };
    switch (type) {
      case 'provider':
        providerList({ ...requestData }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setDisabledList(arr);
          }
        });
        break;
      case 'contract':
        if (!providerId) {
          message.error('请先选择服务商哦');
        } else {
          contractProvider(providerId).then(res => {
            if (res) {
              const arr = [...res.data];
              setSpinLoading(false);
              setContractlist(arr);
            }
          });
        }

        break;
      case 'score':
        scoreListpage({
          scoreName: value,
          pageNum: 1,
          pageSize: 1000,
        }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'clause':
        searchUsers({ ...requestData, scoreId, targetId: target2Type }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'director':
        searchUsers({ userName: value }).then(res => {
          if (res) {
            const arr = [...res.data];
            setSpinLoading(false);
            setDirectorlist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  // 选择下拉值，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, providerName, scoreName, assessType, userName } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          providerName, // 服务商
          providerId: id, // 服务商id
          contractName: '',
          contractId: '',
        });
        getContrractname(id);
        setProviderId(id);
        break;

      case 'score':
        setFieldsValue({
          score: scoreName, // 评分细则名称
          scoreId: id, // 评分细则id
          assessType,
          target1Name: '',
          target1Id: '',
          target2Name: '',
          target2Id: '',
          clauseId: '',
          clauseName: '',
          assessValue: ''
        });
        setScoreId(id);
        getTarget1(assessType === '功能开发' ? '1' : '2');
        break;

      case 'director':
        setFieldsValue({
          directorName: userName, // 服务商,
          directorNamesign:userName,
          directorId: id, // 服务商id
        });
        break;

      default:
        break;
    }
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const getPerformanceleader = () => {
    operationPerson().then(res => {
      const result = res.data.map(item => {
        return {
          key: item.id,
          value: item.userName,
        };
      });
      setPerformanceLeader(result);
    });
  };

  useEffect(() => {
    getPerformanceleader();
  }, []);

  const onChange = (date, dateString) => {
    setFieldsValue({ assessTime: moment(dateString) })
  }

  const assessmentObject = getTypebyTitle('考核对象');

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid='576'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="服务绩效编号">
            {getFieldDecorator('assessNo', {
              initialValue: register.assessNo,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="发生时间">
            {getFieldDecorator('assessTime', {
              rules: [
                {
                  required,
                  message: '请选择发生时间',
                },
              ],
              initialValue: moment(register.assessTime || new Date()),
            })(
              <div>
                <DatePicker
                  disabled={noEdit}
                  defaultValue={moment(register.assessTime || new Date())}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  onChange={onChange}
                />
              </div>
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="服务商">
            {getFieldDecorator('providerName', {
              rules: [
                {
                  required,
                  message: '请输入服务商',
                },
              ],
              initialValue: register.provider?.providerName
                ? register.provider.providerName
                : register.provider,
            })(
              <AutoComplete
                getPopupContainer={e => e.parentNode}
                disabled={noEdit}
                dataSource={disableduser}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
              >
                <Search
                  placeholder="可输入服务商名称搜索"
                  onSearch={values => SearchDisableduser(values, 'provider')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="服务商">
            {getFieldDecorator('providerId', {
              rules: [
                {
                  required,
                  message: '请输入服务商',
                },
              ],
              initialValue: register.providerId,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="关联合同名称">
            {getFieldDecorator('contractId', {
              rules: [
                {
                  required,
                  message: '请选择关联合同名称',
                },
              ],
              initialValue: register.contractId,
            })(
              <Select
                getPopupContainer={e => e.parentNode}
                disabled={noEdit}
                placeholder="请选择"
                allowClear
                onChange={(value, option) => handleChange(value, option, 'contract')}
                onFocus={() => handleFocus('contract')}
              >
                {contractArr.map(obj => [
                  <Option key={obj.contractName} value={obj.id}>
                    <div className={styles.disableuser}>
                      <span>{obj.contractNo}</span>
                      <span>{obj.contractName}</span>
                    </div>
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="关联合同名称">
            {getFieldDecorator('contractName', {
              initialValue: register.contractName,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="责任人">
            {getFieldDecorator('directorNamesign', {
              rules: [
                {
                  required,
                  message: '请选择责任人',
                },
              ],
              initialValue: register.registerName,
            })(
              <AutoComplete
                getPopupContainer={e => e.parentNode}
                disabled={noEdit}
                dataSource={directoruser}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'director')}
              >
                <Search
                  placeholder="可输入人名称搜索"
                  onSearch={values => SearchDisableduser(values, 'director')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="责任人id">
            {getFieldDecorator('directorName', {
              initialValue: register.registerName,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="责任人id">
            {getFieldDecorator('directorId', {
              initialValue: register.directorId,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="评分细则名称">
            {getFieldDecorator('score', {
              rules: [
                {
                  required,
                  message: '请输入评分细则名称',
                },
              ],
              initialValue: register.score?.scoreName ? register.score.scoreName : register.score,
            })(
              <AutoComplete
                getPopupContainer={e => e.parentNode}
                disabled={noEdit}
                dataSource={scorenameList}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'score')}
              >
                <Search
                  placeholder="可输入评分细则名称搜索"
                  onSearch={values => SearchDisableduser(values, 'score')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="评分细则名称">
            {getFieldDecorator('scoreId', {
              initialValue: register.scoreId,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核类型">
            {getFieldDecorator('assessType', {
              initialValue: register.assessType === '1' ? '功能开发' : '系统运维',
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核对象">
            {getFieldDecorator('assessObject', {
              rules: [
                {
                  required,
                  message: '请选择考核对象',
                },
              ],
              initialValue: register.assessObject,
            })(
              <Select
                placeholder="请选择"
                disabled={noEdit}
                getPopupContainer={e => e.parentNode}
              >
                {(assessmentObject || []).map(obj => [
                  <Option key={obj.dict_code} value={obj.dict_code}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="考核内容说明" {...forminladeLayout}>
            {getFieldDecorator('assessContent', {
              rules: [
                {
                  required,
                  message: '请输入考核内容说明',
                },
              ],
              initialValue: register.assessContent,
            })(
              <TextArea
                disabled={noEdit}
                autoSize={{ minRows: 3 }}
                placeholder="请控制字数在500字以内"
                maxLength="500"
              />,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="一级指标">
            {getFieldDecorator('target1Name', {
              rules: [
                {
                  required,
                  message: '请输入一级指标',
                },
              ],
              initialValue: register.target1Name,
            })(
              <Select
                getPopupContainer={e => e.parentNode}
                disabled={noEdit}
                onChange={(value, option) => handleChange(value, option, 'target1Name')}
                onFocus={() => handleFocus('one')}
                placeholder="请选择"
                allowClear
              >
                {target1.map(obj => [
                  <Option key={obj.id} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="一级指标id">
            {getFieldDecorator('target1Id', {
              initialValue: register.target1Id,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="二级指标">
            {getFieldDecorator('target2Name', {
              rules: [
                {
                  required,
                  message: '请输入二级指标',
                },
              ],
              initialValue: register.target2Name,
            })(
              <Select
                disabled={noEdit}
                onChange={(value, option) => handleChange(value, option, 'target2Name')}
                onFo
                cus={() => handleFocus('two')}
                placeholder="请选择"
                allowClear
              >
                {target2.map(obj => [
                  <Option key={obj.id} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label=" 二级指标">
            {getFieldDecorator('target2Id', {
              initialValue: register.target2Id,
            })(<Input />)}
          </Form.Item>
        </Col>

        {
          !noEdit && (
            <Col span={24}>
              <Form.Item label="详细条款" {...forminladeLayout}>
                {getFieldDecorator('clauseId', {
                  rules: [
                    {
                      required,
                      message: '请输入详细条款',
                    },
                  ],
                  initialValue: register.clauseId,
                })(
                  <Select
                    getPopupContainer={e => e.parentNode}
                    disabled={noEdit}
                    onChange={(value, option) => handleChange(value, option, 'clause')}
                    onFocus={() => handleFocus('clause')}
                  >
                    {(clauseList.records || []).map(obj => [
                      <Option key={obj.detailed} value={obj.id}>
                        <div className={styles.disableuser}>
                          <span>{obj.orderNo}</span>
                          <span>{obj.detailed}</span>
                          <span>{obj.calc}</span>
                          <span>{obj.scoreValue}</span>
                          <span>{obj.sources}</span>
                        </div>
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )
        }

        {
          noEdit && (
            <Col span={24}>
              <Form.Item label=" 详细条款" {...forminladeLayout}>
                {getFieldDecorator('clause', {
                  initialValue: (register && register.clause) ? `${register.clause.orderNo}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.detailed}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.calc === 'ADD' ? '加分项' : '扣分项'}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.scoreValue}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.sources}` : '',
                })(
                  <Input disabled className={styles.disableuser} />
                )}
              </Form.Item>
            </Col>
          )
        }

        <Col span={24} style={{ display: 'none' }}>
          <Form.Item label="详细条款" {...forminladeLayout}>
            {getFieldDecorator('clauseName', {
              initialValue: register.clauseName,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核得分">
            {getFieldDecorator('assessValue', {
              rules: [
                {
                  required,
                  message: '请输入考核得分',
                },
              ],
              initialValue: register.assessValue,
            })(<Input disabled={noEdit} type="number" />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核状态">
            {getFieldDecorator('status', {
              initialValue: register.status,
            })(<Input disabled={true} />)}
          </Form.Item>
        </Col>

        {!noEdit && (
          <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('attachment', {
                initialValue: register.attachment,
              })(
                <div style={{ width: 400 }}>
                  <SysUpload
                    fileslist={files}
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                  />
                </div>,
              )}
            </Form.Item>
          </Col>
        )}

        {noEdit && (
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {register.attachment && <Downloadfile files={register.attachment} />}
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item label="登记人">
            {getFieldDecorator('registerName', {
              initialValue: register.registerName || userinfo.userName,
            })(<Input disabled={noEdit} />)}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="登记人">
            {getFieldDecorator('register', {
              initialValue: register.register || userinfo.userauthorityid,
            })(<Input disabled={noEdit} />)}
          </Form.Item>
        </Col>



        <Col span={8}>
          <Form.Item label="登记时间">
            {getFieldDecorator('applyTime', {
              initialValue: moment(register.applyTime || new Date()),
            })(<DatePicker
              disabled={true}
              showTime
              format="YYYY-MM-DD HH:mm"
            />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

Register.defaultProps = {
  register: {
    assessNo: '',
    assessTime: '',
    applyTime: '',
    provider: '',
    providerId: '',
    target1Name: '',
    target2Name: '',
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
    clauseName: '',
    assessValue: '',
    status: '',
    remark: '',
    attachment: '',
    registerName: '',
    clause: {
      orderNo: '',
      detailed: '',
      calc: '',
      scoreValue: '',
      sources: ''
    },
    register: sessionStorage.getItem('userauthorityid')
  },
};

export default Form.create({})(Register);
