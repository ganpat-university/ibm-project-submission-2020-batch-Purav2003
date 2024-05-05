import React from 'react';
import { Modal,Button,Form,Input,TimePicker } from 'antd';
const EditModal = ({isModalOpen,handleOk,handleCancel,setEditData}) => {
  return (
    <div>
      <Modal title="Change your Exit time" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
            Return
        </Button>,
        <Button key="submit" type="primary" className='bg-blue-500' onClick={handleOk}>
            Submit
        </Button>,
      ]}
      >
       <Form>
       <Form.Item label="Enter Exit Time">
          <TimePicker onChange={
            (time,timeString) => {
              setEditData({...setEditData,exitTime:timeString})
            }            
          }
          />
          {/* /> */}
        </Form.Item>
       </Form>
      </Modal>
    </div>
  );
}

export default EditModal;