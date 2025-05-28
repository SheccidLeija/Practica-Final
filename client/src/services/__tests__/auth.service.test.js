import AuthService from '../auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  describe('login', () => {
    it('should store token and userId on successful login', async () => {
      const mockResponse = {
        token: 'test-token',
        userId: 'test-user-id'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await AuthService.login('test@test.com', 'password123');

      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('userId')).toBe(mockResponse.userId);
    });

    it('should throw error on failed login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      });

      await expect(AuthService.login('test@test.com', 'wrong-password'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should store token and userId on successful registration', async () => {
      const mockResponse = {
        token: 'test-token',
        userId: 'test-user-id'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await AuthService.register('testuser', 'test@test.com', 'password123');

      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('userId')).toBe(mockResponse.userId);
    });
  });

  describe('logout', () => {
    it('should remove token and userId from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userId', 'test-user-id');

      AuthService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
}); 