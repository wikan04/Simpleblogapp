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
        message.success(`Selamat Datang, ${name}!`);
      })
      .catch(() => {
        message.error('Mohon Berikan Inputan yang Valid!');
      });
  };

  return (
    <Modal
      title="Selamat datang di Wikan Simple Blog"
      open
      footer={null}
      closable={false}
    >
      <p className='my-4'>Silahkan Login Terlebih Dahulu</p>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Username Gorest"
          name="name"
          rules={[{ required: true, message: 'Username Wajib Diisi!' }]}
        >
          <Input placeholder="Masukkan Username" />
        </Form.Item>
        <Form.Item
          label="GoRest Token"
          name="token"
          rules={[{ required: true, message: 'GoRest Token Wajib Diisi!' }]}
        >
          <Input.Password placeholder="Masukkan token GoRest Anda" />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit} block>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default WelcomeDialog;