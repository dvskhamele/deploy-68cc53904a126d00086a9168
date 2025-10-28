// This file is no longer used as we're now using localStorage directly in mockApi.js
// Keeping it for backward compatibility
export const mockData = {
  users: [
    {"id":1,"name":"Alice Kumar","email":"alice@example.com","phone":"017XXXXXXXX","walletBalance":1000,"role":"user","bets":[]},
    {"id":2,"name":"Rahul Das","email":"rahul@example.com","phone":"018XXXXXXXX","walletBalance":500,"role":"user","bets":[]},
    {"id":3,"name":"Admin Name","email":"admin@example.com","phone":"019XXXXXXXX","walletBalance":0,"role":"admin","bets":[]}
  ],
  matches: [
    {
      "category": "Cricket",
      "matches": [
        {"id":101,"teamA":"Team Alpha","teamB":"Team Beta","date":"2025-09-20T15:00:00","odds":{"Team Alpha":1.8,"Team Beta":2.0},"result":null}
      ]
    },
    {
      "category": "Football",
      "matches": [
        {"id":102,"teamA":"Red Lions","teamB":"Blue Tigers","date":"2025-09-21T18:00:00","odds":{"Red Lions":1.9,"Blue Tigers":1.95},"result":null}
      ]
    }
  ],
  bets: [],
  transactions: []
};
