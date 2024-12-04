import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useRouter } from 'next/router';

interface PostFormProps {
    onSubmit: (values: any) => Promise<void>;
    initialValues?: { title: string; body: string; user_id: number };
    users: any[];
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialValues, users }) => {
    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    const handleFinish = async (values: any) => {
        try {
            await onSubmit(values);
            message.success('Post berhasil disimpan!');
            form.resetFields();
        } catch (error) {
            message.error('Terjadi kesalahan saat menyimpan post.');
        }
    };

    return (
        <Form form={form} onFinish={handleFinish}>
            <Form.Item
                name="user_id"
                rules={[{ required: true, message: 'User  ID wajib dipilih!' }]}
            >
                <Select placeholder="Pilih User ID" allowClear>
                    {users.map(user => (
                        <Select.Option key={user.id} value={user.id}>
                            User ID: {user.id}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="title"
                rules={[{ required: true, message: 'Judul wajib diisi!' }]}
            >
                <Input placeholder="Judul" />
            </Form.Item>
            <Form.Item
                name="body"
                rules={[{ required: true, message: 'Isi wajib diisi!' }]}
            >
                <Input.TextArea 
                    placeholder="Isi" 
                    showCount 
                    maxLength={500} // Set batas maksimum karakter
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Simpan
                </Button>

                <Button
                    type="default"
                    onClick={() => router.back()} // Kembali ke halaman sebelumnya
                    className='px-2 py-2 mx-5'
                >
                    Kembali
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PostForm;