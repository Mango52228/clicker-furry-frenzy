import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedScore = localStorage.getItem('hamsterScore');
    const savedMultiplier = localStorage.getItem('hamsterMultiplier');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedMultiplier) setMultiplier(parseInt(savedMultiplier));

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      toast.error("Эта игра доступна только на мобильных устройствах!");
      navigate('/desktop');
    }
    setIsLoading(false);
  }, [navigate]);

  // Save data to localStorage whenever score or multiplier changes
  useEffect(() => {
    localStorage.setItem('hamsterScore', score.toString());
    localStorage.setItem('hamsterMultiplier', multiplier.toString());
  }, [score, multiplier]);

  const handleClick = () => {
    setScore(prev => prev + multiplier);
    // Animate hamster
    const hamster = document.getElementById('hamster');
    if (hamster) {
      hamster.classList.add('animate-bounce');
      setTimeout(() => hamster.classList.remove('animate-bounce'), 200);
    }
  };

  const buyUpgrade = () => {
    if (score >= 10) {
      setScore(prev => prev - 10);
      setMultiplier(prev => prev + 1);
      toast.success("Улучшение куплено!");
    } else {
      toast.error("Недостаточно очков!");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-orange-300 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Hamster Clicker</h1>
          <p className="text-2xl font-semibold text-white">Очки: {score}</p>
          <p className="text-xl text-white">Множитель: x{multiplier}</p>
        </div>

        <div className="flex justify-center">
          <button
            id="hamster"
            onClick={handleClick}
            className="w-48 h-48 bg-white rounded-full shadow-lg flex items-center justify-center transform active:scale-95 transition-transform"
          >
            <span className="text-6xl">🐹</span>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={buyUpgrade}
            className="bg-white px-6 py-3 rounded-full shadow-lg text-pink-500 font-semibold transform active:scale-95 transition-transform"
          >
            Купить улучшение (10 очков)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;