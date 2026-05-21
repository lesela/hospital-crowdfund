import { Quote } from 'lucide-react';

export function Stories() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Cancer Survivor',
      quote: 'The care and compassion I received at Lesela Medical Center gave me the strength to fight. Today, I\'m cancer-free and living life to the fullest.',
      image: 'https://images.unsplash.com/photo-1763310225108-9e16920156f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5jZXIlMjBzdXBwb3J0JTIwaG9wZXxlbnwxfHx8fDE3NjU1Njk5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      name: 'Michael Chen',
      role: 'Family Member',
      quote: 'When my father was diagnosed, the entire team supported our family every step of the way. Their dedication goes beyond medicine.',
      image: 'https://images.unsplash.com/photo-1631295161934-ec6c829d282a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwaGVscGluZ3xlbnwxfHx8fDE3NjU1NjUwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Stories of Hope</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read inspiring stories from patients and families whose lives have been touched by our work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl p-8 relative">
              <Quote className="w-12 h-12 text-pink-300 mb-4" />
              <p className="text-lg text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}