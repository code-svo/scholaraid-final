// Mock user database for demo purposes
let users: {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be a hashed password
}[] = [];

// Mock current user
let currentUser: { id: string; name: string; email: string } | null = null;

// Register a new user
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // Create a new user
    const newUser = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      password // In a real app, hash this password
    };

    // Add to our mock database
    users.push(newUser);
    
    // Auto-login after registration
    currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Registration failed'
    };
  }
};

// Login a user
export const loginUser = async (email: string, password: string) => {
  try {
    // Find user
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Set current user
    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return {
      success: true,
      user: currentUser
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed'
    };
  }
};

// Logout the current user
export const logoutUser = () => {
  currentUser = null;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
  
  return {
    success: true
  };
};

// Get current user
export const getCurrentUser = () => {
  // If we have a current user in memory, return it
  if (currentUser) {
    return currentUser;
  }
  
  // Otherwise check localStorage
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
        return currentUser;
      } catch (e) {
        // Invalid stored user, clear it
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
}; 