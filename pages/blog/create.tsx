import React, { useEffect, useState } from 'react';
import PostForm from '../../components/PostForm';
import axios from 'axios';
import { useRouter } from 'next/router';

const CreatePost = () => {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://gorest.co.in/public/v2/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('goRestToken')}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (values: any) => {
        const postData = {
            user_id: values.user_id,
            title: values.title,
            body: values.body,
        };

        try {
            const response = await axios.post('https://gorest.co.in/public/v2/posts', postData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('goRestToken')}`,
                },
            });
            router.push(`/blog/${response.data.id}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error saat mengirim data:', error.response.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <h2 className='mb-5 text-2xl font-boldtext-xl font-bold leading-none tracking-tight text-gray-900'>Buat Postingan Baru</h2>
            <PostForm onSubmit={handleSubmit} users={users} />
        </div>
    );
};

export default CreatePost;