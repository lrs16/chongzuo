import React, { useState, useRef } from 'react';
import router from 'umi/router';
import { Form, Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Content from './components/Content';
import ToApplays from './components/ToApplays'; // 人员申请详情
import styles from '../index.less';

const { Panel } = Collapse;

function Newcheck(props) {
    const pagetitle = props.route.name;
    const {
        location: { query },
    } = props;

    const ContentRef = useRef(null);
    const [result, setResult] = useState('0'); // 审核结果
    const [activeKey, setActiveKey] = useState(['1']);

    const handleclose = () => { // 关闭返回
        router.push({
            pathname: `/ITSM/operationplan/personaccessmanage/toquery`,
            query: { pathpush: true },
            state: { cache: false }
        });
    }

    const callback = key => {
        // 激活tab
        setActiveKey(key);
    };

    return (
        <PageHeaderWrapper title={pagetitle} extra={<Button onClick={handleclose}>返回</Button>}>
            <div className={styles.collapse}>
                <Collapse
                    expandIconPosition="right"
                    activeKey={activeKey}
                    bordered={false}
                    onChange={callback}
                >
                    <Panel header='人员进出申请' key="1">
                        <ToApplays selectedRows={query && query.record ? query.record : {}} />
                    </Panel>
                    {
                        query && query.checkStatus === '2' && (
                            <Panel header='人员进出审核' key="2">
                                <EditContext.Provider value={{ editable: true }}>
                                    <Content
                                        wrappedComponentRef={ContentRef}
                                        ChangeResult={newvalue => {
                                            setResult(newvalue);
                                        }}
                                        type='toquery'
                                        userinfo={(query && query.userinfo) ? query.userinfo : ''}
                                        selectedRows={query && query.record ? query.record : {}}
                                    />
                                </EditContext.Provider>
                            </Panel>
                        )
                    }
                </Collapse>
            </div >
        </PageHeaderWrapper>
    );
}

export default Form.create({})(Newcheck);