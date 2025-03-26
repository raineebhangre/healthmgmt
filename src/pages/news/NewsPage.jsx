import { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import Loader from '../../components/Loader';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NEWS_API_CONFIG = {
    url: 'https://newsapi.org/v2/top-headlines',
    params: {
      category: 'health',
      country: 'us',
      pageSize: 20,
      apiKey: 'd812c5b08dd64c4db9301b07891d866a'
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const params = new URLSearchParams(NEWS_API_CONFIG.params);
        const response = await fetch(`${NEWS_API_CONFIG.url}?${params}`, {
          headers: {
            'X-Api-Key': import.meta.env.VITE_NEWS_API_KEY
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.articles) {
          throw new Error('No articles found in response');
        }

        const articlesWithIds = data.articles.map((article, index) => ({
          ...article,
          id: `${article.publishedAt}-${index}`,
          votes: localStorage.getItem(`votes-${article.title}`) || 0
        }));

        setArticles(articlesWithIds);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleVote = (articleId, value) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === articleId 
          ? { ...article, votes: article.votes + value }
          : article
      )
    );
    const article = articles.find(a => a.id === articleId);
    localStorage.setItem(`votes-${article.title}`, article.votes + value);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-mainBackgroundColor">
      <Loader className="w-16 h-16 text-accent animate-pulse" />
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-mainBackgroundColor flex flex-col items-center justify-center p-6 text-red-400">
        <div className="max-w-2xl text-center">
          <div className="inline-block bg-red-900/20 p-4 rounded-full mb-6 animate-bounce">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-300 mb-4 font-epilogue bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            News Loading Failed
          </h1>
          <p className="text-red-400/80 mb-6 font-poppins">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-br from-red-600/20 to-pink-500/10 text-red-300 rounded-lg hover:from-red-600/30 transition-all shadow-md border border-red-700/30"
            >
              Retry
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-br from-columnBackgroundColor/20 to-gray-800/10 text-gray-300 rounded-lg hover:from-columnBackgroundColor/30 transition-all shadow-md border border-gray-700/30"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mainBackgroundColor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl font-extrabold mb-4 font-epilogue bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent 
              animate-gradient-x hover:scale-105 transition-transform duration-300">
            Health Pulse
          </h1>
          <p className="text-xl text-gray-300 font-poppins font-medium max-w-2xl mx-auto leading-relaxed 
              hover:text-gray-100 transition-colors duration-300 hover:drop-shadow-glow">
            Cutting-edge medical discoveries & essential health guidance
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles?.length > 0 ? (
            articles.map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                onVote={handleVote}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 animate-fade-in">
              <div className="inline-block bg-columnBackgroundColor p-4 rounded-full mb-6 hover:rotate-12 transition-transform">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-300 font-epilogue bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                Current Health Pulse Unavailable
              </h2>
              <p className="text-gray-400 mt-2 font-poppins">Stay tuned for updates</p>
            </div>
          )}
        </div>

        {/* Enhanced Attribution */}
        <div className="mt-16 text-center border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 font-poppins">
            Medical insights powered by{' '}
            <a 
              href="https://newsapi.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent 
                font-semibold hover:from-blue-300 hover:to-purple-400 transition-all duration-300"
            >
              NewsAPI.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;