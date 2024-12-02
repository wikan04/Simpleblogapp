import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

interface WelcomeDialogProps {
  onLogin: (token: string, name: string) => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ onLogin }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields()
      .then(({ name, token }) => {
        // Kirim data login
        onLogin(token, name);
        message.success(`Welcome, ${name}!`);
      })
      .catch(() => {
        message.error('Please provide valid inputs.');
      });
  };

  return (
    <Modal
      title="Welcome to Blog Post App"
      open
      footer={null}
      closable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Your Name"
          name="name"
          rules={[{ required: true, message: 'Name is required!' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          label="GoRest Token"
          name="token"
          rules={[{ required: true, message: 'Token is required!' }]}
        >
          <Input.Password placeholder="Enter your GoRest token" />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit} block>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default WelcomeDialog;