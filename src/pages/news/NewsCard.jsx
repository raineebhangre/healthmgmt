import { useState } from 'react';

const NewsCard = ({ article, onVote }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleVote = (value) => {
    onVote(article.id, value);
  };

  return (
    <div className="bg-columnBackgroundColor rounded-xl shadow-secondary hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Image Section with Enhanced Gradient */}
      <div className="relative h-48 bg-gray-800">
        <img 
          src={article.urlToImage || 'https://source.unsplash.com/featured/?health'} 
          alt={article.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setIsOpen(true)}
          onError={(e) => {
            e.target.src = 'https://source.unsplash.com/featured/?health'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-300 font-poppins font-medium">
            {article.source?.name}
          </span>
          <span className="text-xs text-gray-400 font-poppins">
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <h3 
          className="font-epilogue font-semibold text-gray-100 mb-2 cursor-pointer line-clamp-2 
            hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 hover:bg-clip-text hover:text-transparent
            transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          {article.title}
        </h3>

        <p className="text-gray-300 text-sm line-clamp-3 mb-4 font-poppins">
          {article.description}
        </p>

        {/* Voting and Actions */}
        <div className="flex items-center justify-between border-t border-gray-700 pt-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleVote(1)}
              className="flex items-center px-3 py-1 rounded-full bg-gradient-to-br from-green-900/40 to-green-800/30 hover:from-green-900/50 transition-all"
            >
              <span className="text-green-300">▲</span>
              <span className="ml-1 text-sm text-gray-100">{article.votes}</span>
            </button>
            <button
              onClick={() => handleVote(-1)}
              className="flex items-center px-3 py-1 rounded-full bg-gradient-to-br from-red-900/40 to-red-800/30 hover:from-red-900/50 transition-all"
            >
              <span className="text-red-300">▼</span>
            </button>
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="text-sm font-poppins bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text 
              hover:from-blue-300 hover:to-purple-400 transition-all flex items-center gap-1"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-mainBackgroundColor rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="relative">
              <img 
                src={article.urlToImage || 'https://source.unsplash.com/featured/?health'} 
                alt={article.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-columnBackgroundColor/80 hover:bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full transition-all shadow-lg"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4 font-epilogue bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {article.title}
              </h2>
              
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-6 font-poppins">
                <span>{article.source?.name}</span>
                <span className="text-gray-500">•</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap mb-6 font-poppins">
                {article.content || 'No content available'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleVote(1)}
                    className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-green-900/40 to-green-800/30 hover:from-green-900/50 transition-all"
                  >
                    <span className="text-green-300">▲</span>
                    <span className="ml-2 text-gray-100">{article.votes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(-1)}
                    className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-red-900/40 to-red-800/30 hover:from-red-900/50 transition-all"
                  >
                    <span className="text-red-300">▼</span>
                  </button>
                </div>
                
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-gray-900 rounded-lg transition-all font-semibold font-poppins flex items-center gap-2"
                >
                  Full Article
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;