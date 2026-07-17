'use client'

import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    content: 'CareerPilot AI helped me land my dream job at Google. The resume analysis was spot-on and the interview prep was invaluable!',
    rating: 5,
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager at Microsoft',
    content: 'The AI job matching is incredibly accurate. I received opportunities I would never have found on my own.',
    rating: 5,
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Data Scientist at Amazon',
    content: 'CareerPilot transformed my job search. The insights helped me understand what skills I needed to develop.',
    rating: 5,
    avatar: 'ER'
  }
]

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">⭐ User Testimonials</h2>
          <p className="text-gray-600 mt-2">Hear from professionals who advanced their careers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover"
            >
              <div className="flex items-start gap-2 text-yellow-400 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <FaQuoteLeft className="text-primary-300 text-2xl mb-2" />
              <p className="text-gray-700 text-sm leading-relaxed">{testimonial.content}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials