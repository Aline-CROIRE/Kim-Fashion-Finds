import React, { useState } from 'react';
import CategoryItem from '../components/CategoryItem';

const categories = [
    { href: "/dress", name: "Dress", imageUrl: "/th(1).jpg" },
    { href: "/t-shirts", name: "T-shirts", imageUrl: "/T-shirt.jpg" },
    { href: "/costume", name: "Costume", imageUrl: "/costume.jpg" },
    { href: "/Trousers", name: "Trousers", imageUrl: "/Trouser.jpg" },
    { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
    { href: "/suits", name: "Suits", imageUrl: "/OIF.jpg" },
    { href: "/bags", name: "Bags", imageUrl: "/th.jpg" },
];

const HomePage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const fadeInStyle = {
      animation: 'fadeIn 1s ease-in-out forwards',
  };

  const textGlowStyle = {
      textShadow: '0 0 10px rgba(140, 158, 255, 0.8)',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform 0.3s',
  };

  return (
    <div className='relative min-h-screen text-[#E0E0E0] bg-[#15253d] overflow-hidden'>
        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
            <h1 
                style={{ ...fadeInStyle, ...textGlowStyle }} 
                className='text-center text-5xl sm:text-6xl font-bold text-[#8C9EFF] mb-4'
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
            >
                Discover the Essence of KIM Fashion Finds
            </h1>
            <p  style={{ ...fadeInStyle, animationDelay: '0.2s' }} className='text-center text-xl font-semibold text-[#E0E0E0] mb-12'>
                Step into a realm where style meets innovation, and each piece tells a story. 
                At KIM Fashion Finds, we believe in the power of fashion to express who you are and inspire confidence.
            </p>
            <p  style={{ ...fadeInStyle, animationDelay: '0.2s' }} className='text-center text-xl font-semibold text-[#E0E0E0] mb-12'>
                Immerse yourself in our thoughtfully curated categories. Each image invites you to explore a world of style and elegance.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {categories.map((category) => (
                    <CategoryItem category={category} key={category.name} />
                ))}
            </div>
        </div>
    </div>
  );
}

export default HomePage;
