
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  
  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect destination from URL if present
  const from = new URLSearchParams(location.search).get('from') || '/';
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to:", from);
      // If user is admin, offer option to go to admin page
      if (user?.role === 'admin') {
        toast({
          title: "Admin logged in",
          description: "Welcome back admin! You can access the admin panel from the navbar.",
        });
        navigate('/admin');
        return;
      }
      
      // If user is doctor, redirect to doctor panel
      if (user?.role === 'doctor') {
        toast({
          title: "Doctor logged in",
          description: "Welcome back doctor! You can access your panel from the navbar.",
        });
        navigate('/doctor-panel');
        return;
      }
      
      // Default redirect
      navigate(from);
    }
  }, [isAuthenticated, navigate, user, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      // Success handling is done within the login function
    } catch (err) {
      console.error('Login error:', err);
      // Error handling is done within the login function
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await register(email, password, name, selectedRole);
      toast({
        title: "Registration successful",
        description: `Please sign in with your new ${selectedRole} account`,
      });
      setActiveTab('login');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Demo accounts for testing
  const demoAccounts = [
    { email: "admin@example.com", password: "password123", role: "admin" },
    { email: "doctor@example.com", password: "password123", role: "doctor" },
    { email: "patient@example.com", password: "password123", role: "patient" }
  ];

  const loginAsDemoUser = async (demoUser: {email: string, password: string, role: string}) => {
    setLoading(true);
    try {
      await login(demoUser.email, demoUser.password);
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to MediConnect</CardTitle>
            <CardDescription className="text-center">
              India's premier healthcare platform
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:underline block text-right">
                      Forgot password?
                    </a>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4">
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="w-full">
                    <p className="text-center text-sm text-gray-500 mb-2">For testing, login as:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {demoAccounts.map((account) => (
                        <Button 
                          key={account.role}
                          variant="outline" 
                          size="sm"
                          disabled={loading}
                          onClick={() => loginAsDemoUser(account)}
                          className="flex items-center gap-1"
                        >
                          {account.role}
                          <Badge variant="outline" className="ml-1 text-xs">
                            {account.email}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="reg-password" className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Register as</label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={selectedRole === 'patient' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('patient')}
                        className="flex-1"
                      >
                        Patient
                      </Button>
                      <Button
                        type="button"
                        variant={selectedRole === 'doctor' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('doctor')}
                        className="flex-1"
                      >
                        Doctor
                      </Button>
                      <Button
                        type="button"
                        variant={selectedRole === 'admin' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('admin')}
                        className="flex-1"
                      >
                        Admin
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
