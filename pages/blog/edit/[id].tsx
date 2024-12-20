// pages/blog/edit/[id].tsx
import React, { useEffect, useState } from 'react';
import PostForm from '../../../components/PostForm';
import axios from 'axios';
import { useRouter } from 'next/router';

const EditPost = () => {
    const router = useRouter();
    const { id } = router.query; // Ambil ID dari URL
    const [post, setPost] = useState<any>(null); // State untuk menyimpan data postingan
    const [users, setUsers] = useState<any[]>([]); // State untuk menyimpan daftar user

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                try {
                    const response = await axios.get(`https://gorest.co.in/public/v2/posts/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('goRestToken')}`,
                        },
                    });
                    setPost(response.data); // Simpan data postingan
                } catch (error) {
                    console.error('Error fetching post:', error);
                }
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://gorest.co.in/public/v2/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('goRestToken')}`,
                    },
                });
                setUsers(response.data); // Simpan daftar user
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchPost();
        fetchUsers();
    }, [id]);

    const handleSubmit = async (values: any) => {
        const postData = {
            user_id: values.user_id,
            title: values.title,
            body: values.body,
        };

        try {
            await axios.put(`https://gorest.co.in/public/v2/posts/${id}`, postData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('goRestToken')}`,
                },
            });
            router.push(`/blog/${id}`); // Redirect ke halaman detail post
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error saat mengupdate data:', error.response.data); // Log error response
            } else {
                console.error('Unexpected error:', error); // Log error yang tidak terduga
            }
        }
    };

    if (!post) {
        return <div className='px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8'>Loading...</div>; // Tampilkan loading saat data belum ada
    }

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <h2 className='mb-5 text-xl font-bold leading-none tracking-tight text-gray-900'>Edit Postingan</h2>
            <PostForm onSubmit={handleSubmit} initialValues={post} users={users} /> {/* Pass initialValues dan users */}
        </div>
    );
};

export default EditPost;