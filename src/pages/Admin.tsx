import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

const ADMIN_PASSWORD = "admin123"; // In a real app, this should be more secure

interface BannedUser {
  id: string;
  userAgent: string;
  bannedAt: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load banned users from localStorage
    const savedBannedUsers = localStorage.getItem('bannedUsers');
    if (savedBannedUsers) {
      setBannedUsers(JSON.parse(savedBannedUsers));
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Successfully logged in as admin");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleBanUser = () => {
    const newBannedUser: BannedUser = {
      id: Date.now().toString(),
      userAgent: navigator.userAgent,
      bannedAt: new Date().toISOString()
    };
    
    const updatedBannedUsers = [...bannedUsers, newBannedUser];
    setBannedUsers(updatedBannedUsers);
    localStorage.setItem('bannedUsers', JSON.stringify(updatedBannedUsers));
    toast.success("User banned successfully");
  };

  const handleUnbanUser = (id: string) => {
    const updatedBannedUsers = bannedUsers.filter(user => user.id !== id);
    setBannedUsers(updatedBannedUsers);
    localStorage.setItem('bannedUsers', JSON.stringify(updatedBannedUsers));
    toast.success("User unbanned successfully");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          <div className="space-y-4">
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Game
            </Button>
            <Button onClick={handleBanUser} variant="destructive" className="ml-2">
              Ban Current User
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Banned Users</h2>
          {bannedUsers.length === 0 ? (
            <p className="text-gray-500">No banned users</p>
          ) : (
            <div className="space-y-4">
              {bannedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm text-gray-600">User Agent: {user.userAgent}</p>
                    <p className="text-sm text-gray-600">Banned At: {new Date(user.bannedAt).toLocaleString()}</p>
                  </div>
                  <Button onClick={() => handleUnbanUser(user.id)} variant="outline" size="sm">
                    Unban
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;