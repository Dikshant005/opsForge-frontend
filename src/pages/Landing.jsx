import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already logged in, redirect them to the dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-sans text-white overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Blurs */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px] -bottom-10 -right-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute w-[250px] h-[250px] bg-pink-500/20 rounded-full blur-[80px] top-[40%] left-[60%] animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 md:p-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl max-w-4xl w-[90%] mx-auto mt-20 transition-all duration-1000 transform translate-y-0 opacity-100">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">
          Forge Your Operations <br />
          <span className="bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">With Precision</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl leading-relaxed">
          The ultimate platform for seamless ticket management, user coordination, and operational excellence. Streamline your workflow today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/signup" 
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-[0_10px_25px_-10px_rgba(99,102,241,0.6)] hover:-translate-y-1 hover:brightness-110 flex items-center justify-center"
          >
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:-translate-y-1 flex items-center justify-center"
          >
            Log In
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 mt-16 mb-20 max-w-5xl w-[90%] transition-all duration-1000 delay-300 transform translate-y-0 opacity-100">
        <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-8 hover:-translate-y-2 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
          <div className="text-3xl bg-indigo-500/10 w-14 h-14 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">⚡</div>
          <h3 className="text-xl font-bold text-gray-100 mb-3">Lightning Fast</h3>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">Optimized for speed so you can manage your operations without any lag.</p>
        </div>
        
        <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-8 hover:-translate-y-2 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
          <div className="text-3xl bg-purple-500/10 w-14 h-14 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">🛡️</div>
          <h3 className="text-xl font-bold text-gray-100 mb-3">Secure by Design</h3>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">Enterprise-grade security ensuring your operational data is always protected.</p>
        </div>
        
        <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-8 hover:-translate-y-2 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
          <div className="text-3xl bg-pink-500/10 w-14 h-14 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">📊</div>
          <h3 className="text-xl font-bold text-gray-100 mb-3">Real-time Insights</h3>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">Monitor your tickets and user activity with up-to-the-minute dashboards.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
