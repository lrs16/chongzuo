import React, { Component } from 'react';
import { InputNumber, Radio, Tabs, Checkbox, Input } from 'antd';

const { TabPane } = Tabs;
const { Search } = Input;
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
}

// eslint-disable-next-line react/prefer-stateless-function
class CronExpression extends Component {

    render() {
        return (
            <>
                <Tabs type='card' style={{ height: '300px', marginTop: '6px' }}>
                    <TabPane tab='秒' key='1'>
                        <Radio.Group
                        // onChange={e => this.handleRadioChange(e, 'second')}
                        // value={radioValue['second']}
                        >
                            <Radio value={1} style={radioStyle}>
                                每秒执行
                            </Radio>
                            <Radio value='period' style={radioStyle}>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'second', 'min')} 
                                />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'second', 'max')} 
                                />
                                秒
                            </Radio>
                            <Radio value='loop' style={radioStyle}>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'second', 'start')} 
                                />
                                秒开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'second', 'end')}
                                />
                                秒执行一次
                            </Radio>
                            <Radio value='point' style={radioStyle}>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                // onChange={e => this.handleCheckboxChange(e, 'second')}
                                >
                                    指定
                                    {/* {secondCheckbox} */}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='分' key='2'>
                        <Radio.Group
                        // value={radioValue['minute']}
                        // onChange={e => this.handleRadioChange(e, 'minute')}
                        >
                            <Radio value={1} style={radioStyle}>
                                每分执行
                            </Radio>
                            <Radio value='period' style={radioStyle}>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'minute', 'min')} 
                                />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'minute', 'max')} 
                                />
                                分
                            </Radio>
                            <Radio value='loop' style={radioStyle}>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'minute', 'start')} 
                                />
                                分开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'minute', 'end')} 
                                />
                                分执行一次
                            </Radio>
                            <Radio value='point' style={radioStyle}>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                // onChange={e => this.handleCheckboxChange(e, 'minute')}
                                >
                                    指定
                                    {/* {minuteCheckbox} */}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='时' key='3'>
                        <Radio.Group
                        // onChange={e => this.handleRadioChange(e, 'hour')}
                        // value={radioValue['hour']}
                        >
                            <Radio value={1} style={radioStyle}>
                                每小时执行
                            </Radio>
                            <Radio value='period' style={radioStyle}>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={0}
                                    max={23}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'hour', 'min')} 
                                />
                                -
                                <InputNumber
                                    size='small'
                                    min={0}
                                    max={23}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'hour', 'max')} 
                                />
                                时
                            </Radio>
                            <Radio value='loop' style={radioStyle}>
                                从
                                <InputNumber
                                    size='small'
                                    min={0}
                                    max={23}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'hour', 'start')} 
                                />
                                时开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'hour', 'end')} 
                                />
                                时执行一次
                            </Radio>
                            <Radio value='point' style={radioStyle}>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                // onChange={e => this.handleCheckboxChange(e, 'hour')}
                                >
                                    指定
                                    {/* {hourCheckbox} */}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='日' key='4'>
                        <Radio.Group
                        // onChange={e => this.handleRadioChange(e, 'day')}
                        // value={radioValue['day']}
                        >
                            <Radio value={1} style={radioStyle}>
                                每日执行
                            </Radio>
                            <Radio value={2} style={radioStyle}>
                                不指定
                            </Radio>
                            <Radio value='period' style={radioStyle}>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'day', 'min')} 
                                />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'day', 'max')} 
                                />
                                日
                            </Radio>
                            <Radio value='loop' style={radioStyle}>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'day', 'start')} 
                                />
                                日开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'day', 'end')} 
                                />
                                日执行一次
                            </Radio>
                            <Radio value='point' style={radioStyle}>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                // onChange={e => this.handleCheckboxChange(e, 'day')}
                                >
                                    指定
                                    {/* {dayCheckbox} */}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='月' key='5'>
                        <Radio.Group
                        // onChange={e => this.handleRadioChange(e, 'month')}
                        // value={radioValue['month']}
                        >
                            <Radio value={1} style={radioStyle}>
                                每月执行
                            </Radio>
                            <Radio value={2} style={radioStyle}>
                                不指定
                            </Radio>
                            <Radio value='period' style={radioStyle}>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'month', 'min')}
                                />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'month', 'max')} 
                                />
                                月
                            </Radio>
                            <Radio value='loop' style={radioStyle}>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'month', 'start')} 
                                />
                                月开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                // onChange={e => this.handleLoopChange(e, 'month', 'end')} 
                                />
                                月执行一次
                            </Radio>
                            <Radio value='point' style={radioStyle}>
                                <Checkbox.Group style={{ width: '100%' }}
                                // onChange={e => this.handleCheckboxChange(e, 'month')}
                                >
                                    指定
                                    {/* {monthCheckbox} */}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='周' key='6'>
                        <Radio.Group
                        // onChange={e => this.handleRadioChange(e, 'week')}
                        // value={radioValue['week']}
                        >
                            <Radio value={1} style={radioStyle}>
                                每周执行
                            </Radio>
                            <Radio value={2} style={radioStyle}>
                                不指定
                            </Radio>
                            <Radio value='period' style={radioStyle}>
                                周期从 周
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={7}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'week', 'min')} 
                                />
                                - 周
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={7}
                                    defaultValue={1}
                                // onChange={e => this.handlePeriodChange(e, 'week', 'max')} 
                                />
                            </Radio>
                            <Radio value='point' style={radioStyle}>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                // onChange={e => this.handleCheckboxChange(e, 'week')}
                                >
                                    指定
                                    {/* {weekCheckbox} */}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                </Tabs>
                <Search
                    placeholder='生成Cron'
                    enterButton='生成'
                // style={{ width: 400, margin: '10px 0 18px' }}
                //   onSearch={this.createCron}
                //   value={cronText}
                />
            </>
        );
    }
}

export default CronExpression;
