import React from 'react';
import { ChevronRight } from 'lucide-react';

const BlogCard = ({ post, animationDelay = 0 }) => {
  return (
    <div 
      className="group cursor-pointer animate-fade-in-up" 
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-stone-100">
        <img 
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <h3 className="font-serif text-xl text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
        {post.title}
      </h3>
      <p className="text-stone-600 mb-4">{post.excerpt}</p>
      <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
        <span>Read More</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default BlogCard;