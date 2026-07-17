'use client'

import { FaBuilding, FaStar, FaUsers } from 'react-icons/fa'

const companies = [
  { name: 'Google', industry: 'Technology', jobs: 234, rating: 4.8 },
  { name: 'Microsoft', industry: 'Software', jobs: 189, rating: 4.7 },
  { name: 'Amazon', industry: 'E-commerce', jobs: 312, rating: 4.6 },
  { name: 'Meta', industry: 'Social Media', jobs: 156, rating: 4.5 },
  { name: 'Apple', industry: 'Consumer Electronics', jobs: 198, rating: 4.9 },
  { name: 'Netflix', industry: 'Entertainment', jobs: 87, rating: 4.4 }
]

const TopCompanies = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">🏢 Top Companies</h2>
          <p className="text-gray-600 mt-2">Find opportunities at the world's leading companies</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies.map((company) => (
            <div
              key={company.name}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-100 card-hover text-center cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-600">
                <FaBuilding className="text-xl" />
              </div>
              <h4 className="font-semibold mt-2 text-sm">{company.name}</h4>
              <p className="text-xs text-gray-500">{company.industry}</p>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs text-gray-600">
                <FaUsers className="text-gray-400" />
                <span>{company.jobs} jobs</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1 text-yellow-500 text-xs">
                <FaStar />
                <span>{company.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopCompanies