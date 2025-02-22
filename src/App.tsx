import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

type Position =
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "OL"
  | "DL"
  | "LB"
  | "CB"
  | "S"
  | "K"
  | "P";
type GameType =
  | "regular"
  | "bowl"
  | "playoff"
  | "conference"
  | "non-conference";
type StatCategory =
  | "passing"
  | "rushing"
  | "receiving"
  | "defense"
  | "special-teams";

interface PlayerGameStats {
  id: number;
  player_name: string;
  position: Position;
  opponent: string;
  gameType: GameType;
  date: string;
  passing_yards: number;
  passing_TDs: number;
  rushing_yards: number;
  rushing_TDs: number;
  receptions: number;
  receiving_yards: number;
  receiving_TDs: number;
  tackles: number;
  sacks: number;
  interceptions: number;
  game_type: string;
}

function App() {
  const [playerName, setPlayerName] = useState("");
  const [position, setPosition] = useState<Position | "">("");
  const [season, setSeason] = useState("");
  const [opponent, setOpponent] = useState("");
  const [gameType, setGameType] = useState<GameType | "">("");
  const [statCategory, setStatCategory] = useState<StatCategory | "">("");
  const [playerStats, setPlayerStats] = useState<PlayerGameStats[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(3);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch({ preventDefault: () => {} });
  }, [currentPage]);

  const handleSearch = async (
    event?: React.FormEvent | { preventDefault: () => void }
  ) => {
    event?.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/search?offset=${currentPage}&limit=${limit}`,
        {
          player_name: playerName,
          position,
          season,
          opponent,
          game_type: gameType,
        }
      );

      setPlayerStats(response.data.data);
      setTotalResults(response.data.total);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPlayerName(value);

    if (value.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/players`);
      const players = response.data.data.map(
        (player: any) => player.player_name
      );

      const filteredSuggestions = players.filter((name: string) =>
        name.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching player names:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#782F40] text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#782F40] font-bold text-xl">FSU</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Florida State Football</h1>
              <p className="text-[#CEB888]">Player Stats Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#782F40] mb-6 pb-2 border-b-2 border-[#CEB888]">
            Search Players & Games
          </h2>

          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            onSubmit={handleSearch}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={playerName}
                  onChange={handlePlayerNameChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#782F40] focus:border-transparent"
                  placeholder="Enter player name"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-md w-full max-w-[300px] max-h-48 overflow-y-auto z-10">
                    {suggestions.map((name, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setPlayerName(name);
                          setSuggestions([]);
                        }}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#782F40] focus:border-transparent"
              >
                <option value="">All Positions</option>
                <option value="QB">Quarterback (QB)</option>
                <option value="RB">Running Back (RB)</option>
                <option value="WR">Wide Receiver (WR)</option>
                <option value="TE">Tight End (TE)</option>
                <option value="OL">Offensive Line (OL)</option>
                <option value="DL">Defensive Line (DL)</option>
                <option value="LB">Linebacker (LB)</option>
                <option value="CB">Cornerback (CB)</option>
                <option value="S">Safety (S)</option>
                <option value="K">Kicker (K)</option>
                <option value="P">Punter (P)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#782F40] focus:border-transparent"
              >
                <option value="">All Seasons</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opponent
              </label>
              <select
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#782F40] focus:border-transparent"
              >
                <option value="">All Opponents</option>
                <option value="Miami">Miami</option>
                <option value="Florida">Florida</option>
                <option value="Clemson">Clemson</option>
                <option value="NC State">NC State</option>
                <option value="Duke">Duke</option>
                <option value="Pittsburgh">Pittsburgh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Type
              </label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as GameType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#782F40] focus:border-transparent"
              >
                <option value="">All Games</option>
                <option value="regular">Regular Season</option>
                <option value="bowl">Bowl Game</option>
                <option value="playoff">Playoff</option>
                <option value="conference">Conference Game</option>
                <option value="non-conference">Non-Conference</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat Category
              </label>
              <select
                value={statCategory}
                onChange={(e) =>
                  setStatCategory(e.target.value as StatCategory)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#782F40] focus:border-transparent"
              >
                <option value="">All Stats</option>
                <option value="passing">Passing</option>
                <option value="rushing">Rushing</option>
                <option value="receiving">Receiving</option>
                <option value="defense">Defense</option>
                <option value="special-teams">Special Teams</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setPlayerName("");
                  setPosition("");
                  setSeason("");
                  setOpponent("");
                  setGameType("");
                  setStatCategory("");
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#782F40] text-white rounded-md hover:bg-[#631d2e] transition-colors flex items-center space-x-2"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#782F40]">
              Player Game Statistics
            </h2>
            <span className="text-[#782F40] font-medium">
              Showing {playerStats.length} results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#782F40] text-white">
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Game</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Passing Yards</th>
                  <th className="px-4 py-3 text-right">Passing TDs</th>
                  <th className="px-4 py-3 text-right">Rushing Yards</th>
                  <th className="px-4 py-3 text-right">Rushing TDs</th>
                  <th className="px-4 py-3 text-right">Receptions</th>
                  <th className="px-4 py-3 text-right">Receiving Yards</th>
                  <th className="px-4 py-3 text-right">Receiving TDs</th>
                  <th className="px-4 py-3 text-right">Tackles</th>
                  <th className="px-4 py-3 text-right">Sacks</th>
                  <th className="px-4 py-3 text-right">Interceptions</th>
                  <th className="px-4 py-3 text-right">Game Type</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={14} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : playerStats.length > 0 ? (
                  playerStats.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{player.player_name}</td>
                      <td className="px-4 py-3">{player.position}</td>
                      <td className="px-4 py-3">{player.opponent}</td>
                      <td className="px-4 py-3">
                        {new Date(player.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.passing_yards}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.passing_TDs}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.rushing_yards}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.rushing_TDs}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.receptions}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.receiving_yards}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.receiving_TDs}
                      </td>
                      <td className="px-4 py-3 text-right">{player.tackles}</td>
                      <td className="px-4 py-3 text-right">{player.sacks}</td>
                      <td className="px-4 py-3 text-right">
                        {player.interceptions}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {player.game_type}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="text-center py-4">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md disabled:opacity-50"
            >
              «
            </button>

            <span className="px-4 py-2 text-[#782F40] font-medium">
              Page {currentPage + 1} of {Math.ceil(totalResults / limit)}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  (prev + 1) * limit < totalResults ? prev + 1 : prev
                )
              }
              disabled={(currentPage + 1) * limit >= totalResults}
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md disabled:opacity-50"
            >
              »
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#782F40] text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="space-x-6 mb-6">
              <a href="#" className="text-[#CEB888] hover:underline">
                Team Roster
              </a>
              <a href="#" className="text-[#CEB888] hover:underline">
                Schedule
              </a>
              <a href="#" className="text-[#CEB888] hover:underline">
                News
              </a>
              <a href="#" className="text-[#CEB888] hover:underline">
                About
              </a>
              <a href="#" className="text-[#CEB888] hover:underline">
                Contact
              </a>
            </div>
            <div className="text-sm text-gray-300">
              © 2025 Florida State University Athletics. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
