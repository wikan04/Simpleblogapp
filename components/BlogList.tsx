// components/BlogList.tsx
import { useState, useEffect } from 'react';
import { Card, Pagination, Row, Col, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Blog {
    id: number;
    title: string;
    body: string;
    user_id: number; // Tambahkan user_id ke interface Blog
}

const fetchBlogs = async (token: string) => {
    const response = await axios.get(`https://gorest.co.in/public/v2/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { per_page: 100 }
    });
    return response.data;
};

export default function BlogList({ token }: { token: string }) {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // State untuk user_id
    const router = useRouter();

    const { data: blogs = [], isLoading, isError } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => fetchBlogs(token),
        enabled: !!token,
    });

    // Ambil daftar user_id yang unik
    const uniqueUserIds = Array.from(new Set(blogs.map(blog => blog.user_id)));

    // Filter blogs berdasarkan search query dan user_id
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUserId = selectedUserId ? blog.user_id === selectedUserId : true; // Filter berdasarkan user_id
        return matchesSearch && matchesUserId;
    });

    const totalBlogs = filteredBlogs.length;
    const blogsPerPage = 6;
    const paginatedBlogs = filteredBlogs.slice((page - 1) * blogsPerPage, page * blogsPerPage);

    // Effect untuk reset page ke 1 jika search query atau user_id berubah
    useEffect(() => {
        setPage(1); // Reset ke page 1 jika ada perubahan
    }, [searchQuery, selectedUserId]);

    if (isLoading) return <p>Loading blogs ...</p>;
    if (isError) return <p className="text-red-500">Error fetching blogs</p>;

    return (
        <div className="p-6">
            {/* Search Bar */}
            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs..."
                    className="border p-2 w-full text-black mr-4"
                />
                <Select
                    placeholder="Filter by User ID"
                    onChange={(value) => setSelectedUserId(value)}
                    style={{ width: 200 }}
                    allowClear // Menambahkan opsi untuk menghapus filter
                >
                    {uniqueUserIds.map(userId => (
                        <Select.Option key={userId} value={userId}>
                            User ID: {userId}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {/* Blog List */}
            <Row gutter={16}>
                {paginatedBlogs.map((blog) => (
                    <Col span={8} key={blog.id}>
                        <Card
                            hoverable={true}
                            title={blog.title}
                            onClick={() => router.push(`/blog/${blog.id}`)} // Navigate to blog detail on click
                            style={{ marginBottom: 16, cursor: 'pointer' }} // Add cursor pointer for better UX
                        >
                            <p>{blog.body.substring(0, 100)}...</p>
                            <p className="text-gray-500 mt-2">User  ID: {blog.user_id}</p>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <Pagination
                current={page}
                pageSize={blogsPerPage}
                total={totalBlogs}
                onChange={(page) => setPage(page)}
                showSizeChanger={false}
            />
        </div>
    );
}