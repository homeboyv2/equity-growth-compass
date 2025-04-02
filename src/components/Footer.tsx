
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Equity Growth Compass. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          A fair equity distribution tool for startup co-founders.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
