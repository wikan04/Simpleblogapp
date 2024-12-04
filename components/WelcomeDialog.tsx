import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';

interface WelcomeDialogProps {
  onLogin: (token: string, name: string) => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ onLogin }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { name, token } = values;

      // Cek validitas token dengan melakukan permintaan ke API
      await axios.get('https://gorest.co.in/public/v2/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Jika berhasil, panggil onLogin
      onLogin(token, name);
      message.success(`Selamat Datang, ${name}!`);
    } catch (error) {
      // Jika terjadi error, tampilkan pesan kesalahan
      if (axios.isAxiosError(error) && error.response) {
        message.error('Username atau GoRest Token Anda salah.');
      } else {
        message.error('Terjadi kesalahan, silakan coba lagi.');
      }
    }
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