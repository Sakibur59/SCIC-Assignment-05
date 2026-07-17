'use client'

import JobCard from '@/components/JobCard'
import JobFilters from '@/components/JobFilters'
import JobSearch from '@/components/JobSearch'
import JobSkeleton from '@/components/JobSkeleton'
import Pagination from '@/components/Pagination'
import { useState, useEffect } from 'react'
import { jobsData } from '../data/jobs'


const ITEMS_PER_PAGE = 6

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    type: 'All',
    experience: 'All',
    sort: 'relevance'
  })
  const [searchQuery, setSearchQuery] = useState({ query: '', location: '' })

  useEffect(() => {
    // Simulate API loading
    setLoading(true)
    setTimeout(() => {
      setJobs(jobsData)
      setFilteredJobs(jobsData)
      setLoading(false)
    }, 1500)
  }, [])

  useEffect(() => {
    let result = [...jobs]

    // Search filter
    if (searchQuery.query) {
      const query = searchQuery.query.toLowerCase()
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (searchQuery.location) {
      const location = searchQuery.location.toLowerCase()
      result = result.filter(job =>
        job.location.toLowerCase().includes(location)
      )
    }

    // Type filter
    if (filters.type && filters.type !== 'All') {
      result = result.filter(job => job.type === filters.type)
    }

    // Experience filter
    if (filters.experience && filters.experience !== 'All') {
      const expMap = {
        'Entry Level': '0-2 years',
        '1-2 years': '1-2 years',
        '3-5 years': '3-5 years',
        '5+ years': '5+ years'
      }
      result = result.filter(job => {
        const jobExp = job.experience
        if (filters.experience === 'Entry Level') {
          return jobExp.includes('0-2') || jobExp.includes('1-2')
        }
        return jobExp.includes(filters.experience)
      })
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.applyDeadline) - new Date(a.applyDeadline))
        break
      case 'salary-high':
        result.sort((a, b) => {
          const aSal = parseInt(a.salary.replace(/[^0-9]/g, ''))
          const bSal = parseInt(b.salary.replace(/[^0-9]/g, ''))
          return bSal - aSal
        })
        break
      case 'salary-low':
        result.sort((a, b) => {
          const aSal = parseInt(a.salary.replace(/[^0-9]/g, ''))
          const bSal = parseInt(b.salary.replace(/[^0-9]/g, ''))
          return aSal - bSal
        })
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    setFilteredJobs(result)
    setCurrentPage(1)
  }, [jobs, searchQuery, filters])

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({ type: 'All', experience: 'All', sort: 'relevance' })
      return
    }
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Explore Jobs</h1>
        <p className="text-gray-600 mt-1">Find your next career opportunity</p>
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
        </p>
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
          <p className="text-2xl mb-2">🔍</p>
          <h3 className="text-lg font-semibold text-gray-700">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
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