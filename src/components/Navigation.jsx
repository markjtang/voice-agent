import { FaMicrophone } from 'react-icons/fa';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Voice Practice</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-blue-500 text-gray-900">
                <FaMicrophone className="mr-2" />
                Practice
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 