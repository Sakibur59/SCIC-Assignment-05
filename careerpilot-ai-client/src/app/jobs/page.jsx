'use client';

import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import JobSearch from '@/components/JobSearch';
import JobSkeleton from '@/components/JobSkeleton';
import Pagination from '@/components/Pagination';
import { useState, useEffect } from 'react';
import { jobsData } from '../data/jobs';

const ITEMS_PER_PAGE = 6;

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: 'All',
    experience: 'All',
    sort: 'relevance'
  });
  const [searchQuery, setSearchQuery] = useState({ query: '', location: '' });

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let result = [...jobs];

    // Search filter
    if (searchQuery.query) {
      const query = searchQuery.query.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (searchQuery.location) {
      const location = searchQuery.location.toLowerCase();
      result = result.filter(job =>
        job.location.toLowerCase().includes(location)
      );
    }

    // Type filter
    if (filters.type && filters.type !== 'All') {
      result = result.filter(job => job.type === filters.type);
    }

    // Experience filter
    if (filters.experience && filters.experience !== 'All') {
      result = result.filter(job => {
        const jobExp = job.experience.toLowerCase();
        const filterExp = filters.experience.toLowerCase();
        
        if (filterExp === 'entry level') {
          return jobExp.includes('0-2') || jobExp.includes('1-2') || jobExp.includes('entry');
        }
        if (filterExp === '1-2 years') {
          return jobExp.includes('1-2') || jobExp.includes('2');
        }
        if (filterExp === '3-5 years') {
          return jobExp.includes('3-5') || jobExp.includes('3+') || jobExp.includes('4') || jobExp.includes('5');
        }
        if (filterExp === '5+ years') {
          return jobExp.includes('5+') || jobExp.includes('6') || jobExp.includes('7');
        }
        return jobExp.includes(filterExp);
      });
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.applyDeadline) - new Date(a.applyDeadline));
        break;
      case 'salary-high':
        result.sort((a, b) => {
          const aSal = parseInt(a.salary.replace(/[^0-9]/g, ''));
          const bSal = parseInt(b.salary.replace(/[^0-9]/g, ''));
          return bSal - aSal;
        });
        break;
      case 'salary-low':
        result.sort((a, b) => {
          const aSal = parseInt(a.salary.replace(/[^0-9]/g, ''));
          const bSal = parseInt(b.salary.replace(/[^0-9]/g, ''));
          return aSal - bSal;
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // relevance - default order
        break;
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [jobs, searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      // Reset all filters to default
      setFilters({ 
        type: 'All', 
        experience: 'All', 
        sort: 'relevance' 
      });
      setSearchQuery({ query: '', location: '' });
      return;
    }
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type && filters.type !== 'All') count++;
    if (filters.experience && filters.experience !== 'All') count++;
    if (searchQuery.query) count++;
    if (searchQuery.location) count++;
    return count;
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Explore Jobs</h1>
        <p className="text-gray-600 mt-1">
          Find your next career opportunity • {jobsData.length} jobs available
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <JobSearch onSearch={handleSearch} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredJobs.length > 0 ? startIndex + 1 : 0}-
          {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
        </p>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={() => handleFilterChange('clear', null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            Clear all filters ✕
          </button>
        )}
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      ) : currentJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-700">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button
            onClick={() => handleFilterChange('clear', null)}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredJobs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}