import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
        ))}
      </div>
      <p className="text-stone-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
      <div className="flex items-center gap-3">
        <img 
          src={testimonial.image} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-stone-800">{testimonial.name}</p>
          <p className="text-sm text-stone-500">Verified Customer</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;