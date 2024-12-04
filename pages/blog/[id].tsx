import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Breadcrumb, Button, Modal, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';

const fetchBlogDetail = async (id: string, token: string) => {
    const response = await axios.get(`https://gorest.co.in/public/v2/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const BlogDetail = () => {
    const router = useRouter();
    const { id } = router.query; 
    const token = typeof window !== 'undefined' ? localStorage.getItem('goRestToken') : null;

    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ['blogDetail', id],
        queryFn: () => fetchBlogDetail(id as string, token!),
        enabled: !!id && !!token,
    });

    if (isLoading) return <p className='px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8'>Loading blog details...</p>;
    if (isError) return <p className="text-red-500">Error fetching blog details</p>;

    if (!blog) return <p>No blog found.</p>;

    const handleDeleteClick = () => {
        // Membuka modal konfirmasi
        Modal.confirm({
            title: 'Hapus Post',
            content: 'Apakah Anda yakin ingin menghapus post ini?',
            okText: 'Hapus',
            cancelText: 'Batal',
            onOk: handleDeletePost,
        });
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`https://gorest.co.in/public/v2/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Post berhasil dihapus!');
            router.push('/');
        } catch (error) {
            message.error('Gagal menghapus post!');
        }
    };

    return (
        <section className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <div className="">

                {/* Breadcrumbs */}
                <Breadcrumb separator=">" >
                    <Breadcrumb.Item>
                        <Link href="/"> <HomeOutlined /> Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="p-6">
                    <h1 className="text-2xl font-bold my-5">{blog.title}</h1>
                    <p>{blog.body}</p>
                    <p className='mt-3'>Author: {blog.user_id}</p>
                </div>

                <div className="flex justify-between">
                    <Button
                        color="primary" variant="solid"
                        onClick={() => router.push('/')}
                        className='px-2 py-2 mx-5'
                    >
                        Selesai Membaca
                    </Button>

                    <div className="flex justify-normal">
                    <Button
                        color="primary"
                        variant='outlined'
                        onClick={() => router.push(`/blog/edit/${blog.id}`)}
                        className='px-2 py-2 mx-5'
                    >
                        Edit Post
                    </Button>

                    <Button
                        type="primary"
                        danger
                        onClick={handleDeleteClick}
                        className='px-2 py-2 mx-5'
                    >
                        Hapus Post
                    </Button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default BlogDetail;