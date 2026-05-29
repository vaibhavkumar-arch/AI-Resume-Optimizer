const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <p className="mt-4 text-gray-500 max-w-xs">
              Empowering job seekers with AI-driven resume optimization and career guidance.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="/analyze" className="text-gray-500 hover:text-indigo-600 transition-colors">Analyze Resume</a></li>
              <li><a href="/chat" className="text-gray-500 hover:text-indigo-600 transition-colors">Career Coach</a></li>
              <li><a href="/history" className="text-gray-500 hover:text-indigo-600 transition-colors">History</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social links placeholder */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
