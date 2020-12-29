import React from 'react';
import { Descriptions, Form, Row, Col, Input, Select, DatePicker, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemregistration from './Problemregistration';
import Problemreview from './Problemreview';
import Problemsolving from './Problemsolving';
import Problemconfirmation from './Problemconfirmation';
import Confirmationcountersignature from './Confirmationcountersignature';
import Problemclosed from './Problemclosed';

function Problemworkorder(props) {
  const { currentProcess, statue, id, currentObj } = props;

  return (
    <>
      {/* <div style={{marginBottom:'20px'}}>
        <Problemregistration 
          currentProcess={currentProcess}
          statue={statue}
          id={id}
          currentObj={currentObj}
        />
      </div> */}

      <div style={{ marginBottom: '20px' }}>
        <Problemreview
          currentProcess={currentProcess}
          statue={statue}
          id={id}
          currentObj={currentObj}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Problemsolving
          currentProcess={currentProcess}
          statue={statue}
          id={id}
          currentObj={currentObj}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Problemconfirmation
          currentProcess={currentProcess}
          statue={statue}
          id={id}
          currentObj={currentObj}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Confirmationcountersignature
          currentProcess={currentProcess}
          statue={statue}
          id={id}
          currentObj={currentObj}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Problemclosed
          currentProcess={currentProcess}
          statue={statue}
          id={id}
          currentObj={currentObj}
        />
      </div>

      {/* <Problemreview />
    <Problemsolving />
    <Problemconfirmation />
    <Confirmationcountersignature />
    <Problemclosed />
     */}
    </>
  );
}
export default Form.create()(Problemworkorder);
