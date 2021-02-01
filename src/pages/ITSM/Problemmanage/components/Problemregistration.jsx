import React from 'react';
import { Descriptions, Collapse } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import { connect } from 'dva';

const { Panel } = Collapse;

function Problemregistration(props) {
  const { 
    main,
    info,
    loading,
   } = props;
  //  const { problemFlowNodeRows } = registrationDetail;
 
  return (
      <div>
        <>
          <Descriptions>
                <Descriptions.Item label="问题编号">
                  { main.no}
                </Descriptions.Item>

                <Descriptions.Item label="登记时间">
                  { info.registerTime}
                </Descriptions.Item>

                <Descriptions.Item label="发生时间">
                  {info.registerOccurTime}
                </Descriptions.Item>

                <Descriptions.Item label="问题来源">
                  { main.source}
                </Descriptions.Item>

                <Descriptions.Item label="问题分类">
                  {main.type}
                </Descriptions.Item>

                <Descriptions.Item label="重要程度">
                  {main.importance}
                </Descriptions.Item>

                <Descriptions.Item label="期待完成时间">
                  {info.registerExpectTime}
                </Descriptions.Item>

                <Descriptions.Item label="所属项目">
                  { info.registerProject}
                </Descriptions.Item>

                <Descriptions.Item label="影响范围">
                  {info.registerScope}
                </Descriptions.Item>
            
              </Descriptions>
          <Descriptions>
            <Descriptions.Item label="联系电话">
              { info.registerUserPhone }
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="问题标题">
              { main.title}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="问题描述">
              { main.content}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
          <Descriptions.Item label="上传附件">
            <span style={{ color: 'blue', textDecoration: 'underline' }} >
            {info.registerAttachments !== null && <Downloadfile files={info.registerAttachments} />}          
            </span>
          </Descriptions.Item>
        </Descriptions>

          <Descriptions>
        <Descriptions.Item label="填报人">
          { info.registerUser }
        </Descriptions.Item>

        <Descriptions.Item label="填报人单位">
            { info.registerUnit }
        </Descriptions.Item>

        <Descriptions.Item label="填报人部门">
            {info.registerDept}
          </Descriptions.Item>

      </Descriptions>
      </>
    </div>
  );
}
export default (
  connect(({ problemmanage, loading }) => ({
    
    loading: loading.models.problemmanage,
  }))
)(Problemregistration);
