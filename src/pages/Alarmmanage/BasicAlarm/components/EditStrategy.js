import { Form, Input, Row, Button,Table,Col,Popconfirm,Select } from 'antd';
const { Option } = Select;
class EditStrategy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        dataSource:[{
            key: 0,
            warnIndex: '名字',
            aggregationAlgorithm: '',
            indexValue: '',
            nextIndicator:''
        }],
        count:1,
        alarmRelate:[]
    }
}

  componentDidMount() {
    // const dataLength = this.state.dataSource.length;
    // const { alarmRelate } = this.state;
    // for(let i =0;i<dataLength;i++){
    //   const indicatorName = `指标名${i+1}`;
    //   alarmRelate.push(indicatorName);
    // }
    // console.log(alarmRelate);
  }

  handleRowAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
        key: count,
        warnIndex: '',
        aggregationAlgorithm: '',
        indexValue: '',
        nextIndicator:''
    };
    this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
    });
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
        if(!err){
          this.props.onSubmit(values);
            // values.tableDt就是个表格数据的数组，可对获取的值进行处理校验处理
        }
    })
  }

  handleDelete = (index) => {
    const { dataSource } = this.state;
    dataSource.splice(index,1);
    this.setState({
        dataSource: dataSource,
        count: index + 1,
    });
    // const { alarmRelate } = this.state;
  //   alarmRelate.splice(index,1);
  //   this.setState({
  //     alarmRelate: alarmRelate,
  //     count: index + 1,
  // });
  }

render() {
  const { form: { getFieldDecorator },dataSource } = this.props
  const required = true;
  const { detailsid } = this.props;
	return (
    <div>
    <Form>
      <Row>
        <Form.Item>
          <Table 
              columns={[
                  { title: '告警指标', dataIndex: 'warnIndex',render: (text, record, index) => 
                      <Form.Item key={index}>
                          {getFieldDecorator(`tableDt[${index}].warnIndex`,{
                            rules:[
                              {
                                required,
                                message:'请输入',
                              }
                            ],
                            initialValue: this.state.dataSource[index].warnIndex
                          })(
                              <Select style={{width:'100px'}}
                                //  onChange={(value) => { this.handleChange(value, index)}}
                            
                              >
                                <Option key={1} value='名字'>名字</Option>
                                <Option key={2} value='年龄'>年龄</Option>
                              </Select>
                          )}
                      </Form.Item>
                  },
                  { title: '聚合算法', dataIndex: 'aggregationAlgorithm',render: (text, record, index) => 
                      <Form.Item key={index}>
                          {getFieldDecorator(`tableDt[${index}].aggregationAlgorithm`,{
                              rules:[
                                {
                                  required,
                                  message:'请输入',
                                }
                              ],
                              initialValue:this.state.dataSource[index].aggregationAlgorithm
                          })(
                              <Select style={{width:'100px'}}
                                >
                                  <Option key={1} value='名字'>名字</Option>
                                  <Option key={2} value='年龄'>年龄</Option>
                                </Select>
                          )}
                      </Form.Item>
                  },
                  { title: '指标值', dataIndex: 'indexValue',render: (text, record, index) => 
                      <Form.Item key={index}>
                          {getFieldDecorator(`tableDt[${index}].indexValue`,{
                              rules:[
                                {
                                  required,
                                  message:'请输入',
                                }
                              ],
                              initialValue:this.state.dataSource[index].indexValue
                            })(
                              <Select style={{width:'100px'}}
                                >
                                  <Option key={1} value='名字'>名字</Option>
                                  <Option key={2} value='年龄'>年龄</Option>
                                </Select>
                          )}
                      </Form.Item>
                  },
                  { title: '阈值', dataIndex: 'threshold',render: (text, record, index) => 
                      <Form.Item key={index}>
                          {getFieldDecorator(`tableDt[${index}].threshold`,{
                              rules:[
                                {
                                  required,
                                  message:'请输入',
                                }
                              ],
                              initialValue:this.state.dataSource[index].threshold
                          })(
                                <Input type='number' style={{width:'100px'}}></Input>
                          )}
                      </Form.Item>
                  },
                  { title: '告警关系', dataIndex: 'nextIndicator',render: (text, record, index) => 
                      <Form.Item key={index}>
                          {getFieldDecorator(`tableDt[${index}].nextIndicator`,{
                              rules:[
                                {
                                  required,
                                  message:'请输入',
                                }
                              ],
                              initialValue:this.state.dataSource[index].nextIndicator
                          })(
                      
                              // <div>{show?<Select>
                              //    <Option key={1} value='and'>与</Option>
                              //    <Option key={2} value='or'>或</Option>
                              //    {/* <Option key={3} value=''></Option> */}
                              // </Select>:''}</div>
                      
                              <Select
                                // onChange={(value) => { this.handleChange(value, index)}}
                              >
                                <Option key={1} value='and'>与</Option>
                                <Option key={2} value='or'>或</Option>
                                {/* <Option key={3} value=''></Option> */}
                              </Select>
                          )}
                      </Form.Item>
                  },
                  {
                    title:'操作',
                    render:(text,record,index) => (
                      <div>
                        <Popconfirm title="确定删除此项吗？" onConfirm={() => this.handleDelete(index)}>
                          <a type="link">删除</a>
                        </Popconfirm>
                      </div>
                    )
                  }
              ]}
              dataSource={this.state.dataSource}
              pagination={false}
          />
        </Form.Item>
    </Row>
    </Form>
    <Row>
        <Col span={24}>
          <Button 
          onClick={ this.handleRowAdd} 
          type="dashed" 
          style={{width:'100%'}}
          icon="plus"
          >增加</Button>
        </Col>
    </Row>
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
      <div style={{display:detailsid?'inline-block':'none',marginTop:'5px'}}>
        <Button style={{display:'inline',marginRight:'5px'}}>取消</Button>
        <Button type='primary' htmlType='submit' onClick={this.handleOk}>提交</Button>
      </div>
    </Col>
    </Row>
  </div>
	)
}
}
export default Form.create()(EditStrategy);
