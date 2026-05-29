const SkillsComparison = ({ skillsToAdd, skillsToRemove, skillsToReword }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Skills to Add */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-green-700 uppercase tracking-wider flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Skills to Add
        </h4>
        <div className="space-y-2">
          {skillsToAdd?.length > 0 ? (
            skillsToAdd.map((item, idx) => (
              <div key={idx} className="p-3 bg-green-50 border border-green-100 rounded-xl group relative">
                <p className="text-sm font-semibold text-green-900">{item.skill}</p>
                <p className="text-xs text-green-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.reason}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No critical skills missing.</p>
          )}
        </div>
      </div>

      {/* Skills to Remove */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
          Skills to Remove
        </h4>
        <div className="space-y-2">
          {skillsToRemove?.length > 0 ? (
            skillsToRemove.map((item, idx) => (
              <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-xl group relative">
                <p className="text-sm font-semibold text-red-900">{item.skill}</p>
                <p className="text-xs text-red-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.reason}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No skills recommended for removal.</p>
          )}
        </div>
      </div>

      {/* Skills to Reword */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Skills to Reword
        </h4>
        <div className="space-y-2">
          {skillsToReword?.length > 0 ? (
            skillsToReword.map((item, idx) => (
              <div key={idx} className="p-3 bg-blue-50 border border-blue-100 rounded-xl group relative">
                <div className="flex items-center text-xs mb-1">
                  <span className="text-gray-500 line-through mr-2">{item.current}</span>
                  <svg className="w-3 h-3 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="font-bold text-blue-900">{item.suggested}</span>
                </div>
                <p className="text-xs text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.reason}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No rewordings suggested.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsComparison;
