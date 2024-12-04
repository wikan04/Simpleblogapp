// components/BlogList.tsx
import { useState, useEffect } from 'react';
import { Card, Pagination, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Blog {
    id: number;
    title: string;
    body: string;
    user_id: number;
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
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const router = useRouter();

    const { data: blogs = [], isLoading, isError } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => fetchBlogs(token),
        enabled: !!token,
    });

    const uniqueUserIds: number[] = Array.from(new Set(blogs.map((blog: Blog) => blog.user_id)));

    const filteredBlogs = blogs.filter((blog: Blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUserId = selectedUserId ? blog.user_id === selectedUserId : true;
        return matchesSearch && matchesUserId;
    });

    const totalBlogs = filteredBlogs.length;
    const blogsPerPage = 6;
    const paginatedBlogs = filteredBlogs.slice((page - 1) * blogsPerPage, page * blogsPerPage);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedUserId]);

    if (isLoading) return <p className='px-4 py-5 mx-auto'>Loading blogs ...</p>;
    if (isError) return <p className="text-red-500">Error fetching blogs</p>;

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
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
                    onChange={(value) => setSelectedUserId(value as number)}
                    style={{ width: 200 }}
                    allowClear
                >
                    {uniqueUserIds.map(userId => (
                        <Select.Option key={userId} value={userId}>
                            User ID: {userId}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {/* Blog List */}
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {paginatedBlogs.map((blog: Blog) => (
                    <Card
                        key={blog.id}
                        hoverable
                        title={blog.title}
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-sm"
                    >
                        <p className="mb-2 text-gray-700 text-ellipsis line-clamp-3">
                            {blog.body}
                        </p>

                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                current={page}
                pageSize={blogsPerPage}
                total={totalBlogs}
                onChange={(page) => setPage(page)}
                showSizeChanger={false}
                className="mt-6"
            />
        </div>
    );
}