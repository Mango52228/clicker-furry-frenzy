import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [maxEnergy, setMaxEnergy] = useState(5000);
  const [currentEnergy, setCurrentEnergy] = useState(5000);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedScore = localStorage.getItem('hamsterScore');
    const savedMultiplier = localStorage.getItem('hamsterMultiplier');
    const savedMaxEnergy = localStorage.getItem('hamsterMaxEnergy');
    const savedCurrentEnergy = localStorage.getItem('hamsterCurrentEnergy');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedMultiplier) setMultiplier(parseInt(savedMultiplier));
    if (savedMaxEnergy) setMaxEnergy(parseInt(savedMaxEnergy));
    if (savedCurrentEnergy) setCurrentEnergy(parseInt(savedCurrentEnergy));

    // Check if user is banned
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    const isUserBanned = bannedUsers.some((user: any) => 
      user.userAgent === navigator.userAgent && user.isBanned
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

  // Energy regeneration system
  useEffect(() => {
    const regenInterval = setInterval(() => {
      const regenRate = parseInt(localStorage.getItem('energyRegenRate') || '10');
      setCurrentEnergy(prev => {
        const newEnergy = Math.min(prev + regenRate, maxEnergy);
        localStorage.setItem('hamsterCurrentEnergy', newEnergy.toString());
        return newEnergy;
      });
    }, 1000);

    return () => clearInterval(regenInterval);
  }, [maxEnergy]);

  // Save data to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('hamsterScore', score.toString());
    localStorage.setItem('hamsterMultiplier', multiplier.toString());
    localStorage.setItem('hamsterMaxEnergy', maxEnergy.toString());
  }, [score, multiplier, maxEnergy]);

  const handleClick = () => {
    if (currentEnergy >= 100) {
      setScore(prev => prev + multiplier);
      setCurrentEnergy(prev => {
        const newEnergy = prev - 100;
        localStorage.setItem('hamsterCurrentEnergy', newEnergy.toString());
        return newEnergy;
      });
    } else {
      toast.error("Not enough energy!");
    }
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

  const handleUpgradeEnergy = () => {
    const upgradeCost = Math.floor(maxEnergy * 0.2); // 20% of current max energy
    if (score >= upgradeCost) {
      setScore(prev => prev - upgradeCost);
      setMaxEnergy(prev => {
        const newMax = prev + 1000;
        setCurrentEnergy(newMax); // Fill energy when upgraded
        return newMax;
      });
      toast.success("Energy capacity upgraded!");
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
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Energy: {currentEnergy}/{maxEnergy}</p>
              <Progress value={(currentEnergy / maxEnergy) * 100} className="h-2" />
            </div>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-8 px-4 rounded-lg shadow-lg active:transform active:scale-95 transition-transform disabled:opacity-50"
          disabled={currentEnergy < 100}
        >
          Click Me! (Costs 100 energy)
        </button>

        <button
          onClick={handleUpgrade}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg"
        >
          Upgrade Multiplier (Cost: {multiplier * 10} points)
        </button>

        <button
          onClick={handleUpgradeEnergy}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg"
        >
          Upgrade Energy Capacity (Cost: {Math.floor(maxEnergy * 0.2)} points)
        </button>
      </div>
    </div>
  );
};

export default Index;