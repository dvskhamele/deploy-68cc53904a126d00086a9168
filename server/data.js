let users = [
    { id: 1, name: 'Admin User', email: 'admin@tk999.com', phone: '01234567890', wallet: { balance: 99999, currency: 'BDT' } },
    { id: 2, name: 'Test User', email: 'test@tk999.com', phone: '01987654321', wallet: { balance: 500, currency: 'BDT' } },
];

let matches = [
    {
        category: 'Cricket',
        matches: [
            { id: 1, teams: ['Bangladesh', 'India'], date: '2025-09-15T14:00:00Z', odds: { 'Bangladesh': 2.5, 'India': 1.5 }, result: null },
            { id: 2, teams: ['Pakistan', 'Australia'], date: '2025-09-16T10:00:00Z', odds: { 'Pakistan': 2.1, 'Australia': 1.7 }, result: null },
        ]
    },
    {
        category: 'Football',
        matches: [
            { id: 3, teams: ['Brazil', 'Argentina'], date: '2025-09-17T19:00:00Z', odds: { 'Brazil': 2.2, 'Argentina': 3.0, Draw: 2.5 }, result: null },
            { id: 4, teams: ['Real Madrid', 'Barcelona'], date: '2025-09-18T21:00:00Z', odds: { 'Real Madrid': 1.8, 'Barcelona': 2.8, Draw: 2.9 }, result: null },
        ]
    }
];

let bets = [
    { id: 1, userId: 2, matchId: 1, team: 'Bangladesh', amount: 100, status: 'Pending', date: '2025-09-12T10:30:00Z' },
];

let transactions = [
    { id: 1, userId: 2, date: '2025-09-12T09:00:00Z', type: 'Deposit', amount: 1000, status: 'Completed' },
    { id: 2, userId: 2, date: '2025-09-12T09:05:00Z', type: 'Withdrawal', amount: 500, status: 'Completed' },
];

module.exports = { users, matches, bets, transactions };
