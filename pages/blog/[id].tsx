// pages/blog/[id].tsx
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Breadcrumb, Button } from 'antd';
import{HomeOutlined} from '@ant-design/icons';

const fetchBlogDetail = async (id: string, token: string) => {
    const response = await axios.get(`https://gorest.co.in/public/v2/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const BlogDetail = () => {
    const router = useRouter();
    const { id } = router.query; // Ambil ID dari URL
    const token = typeof window !== 'undefined' ? localStorage.getItem('goRestToken') : null;

    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ['blogDetail', id],
        queryFn: () => fetchBlogDetail(id as string, token!),
        enabled: !!id && !!token, // Hanya jalankan jika ID dan token ada
    });

    if (isLoading) return <p>Loading blog details...</p>;
    if (isError) return <p className="text-red-500">Error fetching blog details</p>;

    // Tambahkan pemeriksaan untuk memastikan blog tidak undefined
    if (!blog) return <p>No blog found.</p>;

    return (

        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">

                <div className="p-6">
                    {/* Breadcrumbs */}
                    <Breadcrumb separator=">" >
                        <Breadcrumb.Item >
                            <a href="/"> <HomeOutlined /> Home</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
                    </Breadcrumb>

                    {/* Button to go back */}


                    <h1 className="text-2xl font-bold my-5">{blog.title}</h1>
                    <p>{blog.body}</p>
                    <p className='mt-3' >Author: {blog.user_id}</p>
                </div>
                <Button
                    type="primary"
                    onClick={() => router.push('/')}
                    className='px-2 py-2 mx-5'
                >
                    Selesai Membaca
                </Button>
            </div>
        </section>
    );
};

export default BlogDetail;