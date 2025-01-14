const Desktop = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-orange-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-xl">
        <h1 className="text-3xl font-bold text-pink-500 mb-4">
          Мобильная версия
        </h1>
        <p className="text-gray-600">
          Извините, но эта игра доступна только на мобильных устройствах. Пожалуйста, откройте игру на своем телефоне или планшете.
        </p>
        <div className="mt-6 text-6xl">
          📱
        </div>
      </div>
    </div>
  );
};

export default Desktop;