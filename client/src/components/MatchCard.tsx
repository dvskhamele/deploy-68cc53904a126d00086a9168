import { useToast } from '../hooks/useToast';

interface Match {
    id: number;
    teams: string[];
    date: string;
    odds: { [key: string]: number };
    result: string | null;
}

interface MatchCardProps {
    match: Match;
    onPlaceBet: (matchId: number, team: string, amount: number) => void;
}

export default function MatchCard({ match, onPlaceBet }: MatchCardProps) {
    const { showToast } = useToast();
    
    const handleBet = (team: string) => {
        const amount = prompt(`Enter amount to bet on ${team}:`, '100');
        if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
            onPlaceBet(match.id, team, parseInt(amount));
        } else if (amount) {
            showToast('Please enter a valid amount', 'error');
        }
    };

    // Format date and time
    const matchDate = new Date(match.date);
    const dateStr = matchDate.toLocaleDateString();
    const timeStr = matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    // Check if match has started
    const hasStarted = new Date() > matchDate;

    return (
        <div className="card transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                    <h4 className="text-xl font-bold text-center flex-1 px-4">
                        {match.teams.join(' vs ')}
                    </h4>
                </div>
                
                <div className="text-center text-gray-600 mb-6 flex items-center justify-center bg-gray-100 py-2 rounded-lg">
                    <span className="mr-2">📅</span>
                    {dateStr} at {timeStr}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {match.teams.map(team => (
                        <button
                            key={team}
                            onClick={() => handleBet(team)}
                            className="btn btn-primary flex flex-col items-center justify-center py-5 rounded-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={hasStarted || !!match.result}
                            title={hasStarted || match.result ? "Match has started or finished" : `Bet on ${team}`}
                        >
                            <span className="text-lg font-bold">{team}</span>
                            <span className="text-2xl mt-2">💰 {match.odds[team]}</span>
                        </button>
                    ))}
                    {match.odds.Draw && (
                        <button
                            onClick={() => handleBet('Draw')}
                            className="btn btn-warning flex flex-col items-center justify-center py-5 rounded-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={hasStarted || !!match.result}
                            title={hasStarted || match.result ? "Match has started or finished" : "Bet on Draw"}
                        >
                            <span className="text-lg font-bold">Draw</span>
                            <span className="text-2xl mt-2">💰 {match.odds.Draw}</span>
                        </button>
                    )}
                </div>
                
                {match.result ? (
                    <div className="text-center py-4 bg-gradient-success rounded-xl flex items-center justify-center">
                        <span className="font-bold text-white flex items-center text-lg">
                            <span className="mr-2 text-2xl">🏆</span>
                            Winner: {match.result}
                        </span>
                    </div>
                ) : hasStarted ? (
                    <div className="text-center py-4 bg-gradient-warning rounded-xl flex items-center justify-center">
                        <span className="font-bold text-white flex items-center text-lg">
                            <span className="mr-2 text-2xl">⏳</span>
                            Match in progress
                        </span>
                    </div>
                ) : (
                    <div className="text-center py-4 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <span className="font-bold text-white flex items-center text-lg">
                            <span className="mr-2 text-2xl">⏰</span>
                            Match not started
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
