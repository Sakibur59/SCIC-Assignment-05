'use client'

const JobFilters = ({ filters, onFilterChange }) => {
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Hybrid', 'Contract', 'Internship']
  const experienceLevels = ['All', 'Entry Level', '1-2 years', '3-5 years', '5+ years']
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Job Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
          <select
            value={filters.type || 'All'}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <select
            value={filters.experience || 'All'}
            onChange={(e) => onFilterChange('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={filters.sort || 'relevance'}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => onFilterChange('clear', null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;