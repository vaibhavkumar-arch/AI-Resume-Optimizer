const ProjectSuggestions = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects?.length > 0 ? (
        projects.map((project, idx) => (
          <div key={idx} className="p-5 border border-gray-100 rounded-2xl bg-white hover:border-indigo-200 transition-colors shadow-sm group">
            <h4 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h4>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack?.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-indigo-600 font-medium italic">
                {project.whyRelevant}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic col-span-2">No projects suggested.</p>
      )}
    </div>
  );
};

export default ProjectSuggestions;
