"use client";

export default function SearchPageComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">搜索鋪位</h1>
          <p className="text-lg text-gray-300 mb-8">
            搜尋香港各區散租鋪位、Pop-up Store、市集場地
          </p>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="輸入地區、租金或鋪位類型..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
