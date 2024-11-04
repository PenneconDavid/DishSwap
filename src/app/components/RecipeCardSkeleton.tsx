const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 skeleton-loading" />
      </div>
      <div className="p-4">
        <div className="h-6 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="flex justify-between">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
