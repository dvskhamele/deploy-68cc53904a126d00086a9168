// Initialize user in localStorage if not already present
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('tk999_user')) {
    const defaultUser = {
      id: 'TK999',
      name: 'Demo User',
      balance: 1000,
      currency: 'BDT',
      membership: 'Member',
      avatar: '⭐',
      email: 'demo@example.com',
      phone: '+1234567890',
      joinDate: new Date('2025-09-28').toISOString(),
      totalBets: 0,
      wins: 0,
      losses: 0
    };
    
    localStorage.setItem('tk999_user', JSON.stringify(defaultUser));
    console.log('Demo user initialized in localStorage');
  }
});