'use client'

import { FaCalendarAlt, FaUser } from 'react-icons/fa'

const blogs = [
  {
    id: 1,
    title: '10 Tips for Acing Your Virtual Interview',
    excerpt: 'Master the art of virtual interviews with these proven strategies from industry experts.',
    author: 'Jane Smith',
    date: 'Dec 15, 2023',
    category: 'Interview Tips',
    image: '💼'
  },
  {
    id: 2,
    title: 'The Rise of AI in Recruitment',
    excerpt: 'How artificial intelligence is transforming the hiring process and what it means for job seekers.',
    author: 'John Doe',
    date: 'Dec 12, 2023',
    category: 'Industry Trends',
    image: '🤖'
  },
  {
    id: 3,
    title: 'Top Skills for 2024 Job Market',
    excerpt: 'Discover the most in-demand skills employers are looking for in the current job market.',
    author: 'Sarah Lee',
    date: 'Dec 10, 2023',
    category: 'Career Advice',
    image: '📈'
  }
]

const CareerBlogs = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">📝 Latest Career Blogs</h2>
            <p className="text-gray-600 mt-1">Stay updated with the latest career advice and insights</p>
          </div>
          <a href="/blog" className="text-primary-600 hover:underline text-sm font-medium">
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 card-hover cursor-pointer overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-6xl">
                {blog.image}
              </div>
              <div className="p-6">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {blog.category}
                </span>
                <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaUser className="text-gray-400" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-400" />
                    {blog.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CareerBlogs