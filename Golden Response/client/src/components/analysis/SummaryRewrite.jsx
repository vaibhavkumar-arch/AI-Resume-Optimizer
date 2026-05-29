import toast from 'react-hot-toast';

const SummaryRewrite = ({ current, suggested, reasoning }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(suggested);
    toast.success('Suggested summary copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Summary</h4>
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 italic">
            {current || 'No summary found in resume.'}
          </div>
        </div>

        {/* Suggested Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Suggested Summary</h4>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              <svg className="w-3.0 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </button>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-900 font-medium leading-relaxed">
            {suggested}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Why this works</h4>
        <p className="text-sm text-blue-700">{reasoning}</p>
      </div>
    </div>
  );
};

export default SummaryRewrite;
