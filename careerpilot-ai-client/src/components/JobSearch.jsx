'use client'

import { useState } from 'react'

const JobSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ query, location })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
          <input
            type="text"
            placeholder="Location (city, state, remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-8 py-2.5 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
        >
          <span>🔍</span> Search
        </button>
      </div>
    </form>
  );
};

export default JobSearch;