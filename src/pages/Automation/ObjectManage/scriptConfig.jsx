import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import LocalScriptList from './components/LocalScriptList';
import SystemScriptList from './components/SystemScriptList';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

const tabList = [
    {
        key: 'systemscript',
        tab: '作业脚本',
    },
    {
        key: 'localscript',
        tab: '服务器脚本',
    },
];

function ScriptConfig(props) {
    const pagetitle = props.route.name;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [tabActivekey, settabActivekey] = useState('systemscript'); // 打开标签/默认

    const handleTabChange = key => {
        settabActivekey(key);
    };

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const scripttypemap = getTypebyId(745); // 脚本类型
    const scriptsourcemap = getTypebyId(747); // 脚本来源
    const scriptstatusmap = getTypebyId(750); // 脚本状态

    return (
        <PageHeaderWrapper
            title={pagetitle}
            tabList={tabList}
            tabActiveKey={tabActivekey}
            onTabChange={handleTabChange}
        >
            <DictLower
                typeid={744}
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            {tabActivekey === 'systemscript' && ( // 系统脚本
                <SystemScriptList
                    scriptsourcemap={scriptsourcemap}
                    scriptstatusmap={scriptstatusmap}
                    scripttypemap={scripttypemap}
                    formItemLayout={formItemLayout}
                />
            )}
            {tabActivekey === 'localscript' && ( // 本地脚本
                <LocalScriptList
                    scriptsourcemap={scriptsourcemap}
                    scripttypemap={scripttypemap}
                    formItemLayout={formItemLayout}
                />
            )}
        </PageHeaderWrapper>
    );
}

export default ScriptConfig;