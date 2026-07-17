'use client'

import { FaUsers, FaBuilding, FaCheckCircle, FaRocket } from 'react-icons/fa'
import CountUp from 'react-countup'

const stats = [
  { icon: FaUsers, label: 'Active Users', value: 50000, suffix: '+' },
  { icon: FaBuilding, label: 'Companies', value: 5000, suffix: '+' },
  { icon: FaCheckCircle, label: 'Success Rate', value: 94, suffix: '%' },
  { icon: FaRocket, label: 'Jobs Placed', value: 12000, suffix: '+' }
]

const SuccessStats = () => {
  return (
    <section className="gradient-hero py-16 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto text-2xl">
                <stat.icon />
              </div>
              <div className="text-3xl font-bold mt-3">
                <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-blue-100 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SuccessStats