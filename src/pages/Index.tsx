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

    // Check if user is banned
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    const isUserBanned = bannedUsers.some((user: any) => 
      user.userAgent === navigator.userAgent
    );

    if (isUserBanned) {
      toast.error("You have been banned from accessing this game");
      navigate('/desktop');
      return;
    }

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      toast.error("This game is only available on mobile devices");
      navigate('/desktop');
      return;
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
  };

  const handleUpgrade = () => {
    if (score >= multiplier * 10) {
      setScore(prev => prev - multiplier * 10);
      setMultiplier(prev => prev + 1);
      toast.success("Multiplier upgraded!");
    } else {
      toast.error("Not enough points!");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Hamster Clicker</h1>
          <div className="text-center space-y-2">
            <p className="text-xl">Score: {score}</p>
            <p className="text-lg">Multiplier: {multiplier}x</p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-8 px-4 rounded-lg shadow-lg active:transform active:scale-95 transition-transform"
        >
          Click Me!
        </button>

        <button
          onClick={handleUpgrade}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg"
        >
          Upgrade Multiplier (Cost: {multiplier * 10} points)
        </button>
      </div>
    </div>
  );
};

export default Index;