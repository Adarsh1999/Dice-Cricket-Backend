
/**
 * Cricket teams and their players data
 * Contains player names for different international cricket teams
 */
const playerNames = {
  Australia: [
    "Travis Head",
    "David Warner",
    "Steven Smith",
    "Glenn Maxwell",
    "Alex Carey",
    "Marcus Stoinis",
    "Marnus Labuschagne",
    "Pat Cummins",
    "Mitchell Starc",
    "Josh Hazlewood",
    "Adam Zampa",
  ],
  New_Zealand: [
    "Devon Conway",
    "Rachin Ravindra",
    "Kane Williamson",
    "Daryl Mitchell",
    "Glenn Phillips",
    "Tom Latham",
    "Mitchell Santner",
    "Ish Sodhi",
    "Trent Boult",
    "Tim Southee",
    "Henry Nicholls",
  ],
  India: [
    "Rohit Sharma",
    "Shikhar Dhawan",
    "Virat Kohli",
    "K. L. Rahul",
    "M.S Dhoni",
    "Hardik Pandya",
    "Ravindra Jadeja",
    "Akshar Patel",
    "Mohammed Shami",
    "Jasprit Bumrah",
    "Arshdeep Singh",
  ],
  England: [
    "Jonny Bairstow",
    "Phil Salt",
    "Joe Root",
    "Harry Brook",
    "Jos Buttler",
    "Ben Stokes",
    "Jofra Archer",
    "Sam Curran",
    "Chris Woakes",
    "Adil Rashid",
    "Mark Wood",
  ],
  South_Africa: [
    "Quinton de Kock",
    "Temba Bavuma",
    "Rassie van der Dussen",
    "Aiden Markram",
    "Heinrich Klaasen",
    "David Miller",
    "Marco Jansen",
    "Keshav Maharaj",
    "Kagiso Rabada",
    "Lungi Ngidi",
    "Tabraiz Shamsi",
  ],
};

/**
 * Get list of available teams
 * @returns {string[]} Array of team names
 */
export const getAvailableTeams = () => Object.keys(playerNames);

/**
 * Get players for a specific team
 * @param {string} teamName - Name of the team
 * @returns {string[]|null} Array of player names or null if team not found
 */
export const getTeamPlayers = (teamName) => playerNames[teamName] || null;

/**
 * Check if a team exists
 * @param {string} teamName - Name of the team to check
 * @returns {boolean} True if team exists
 */
export const isValidTeam = (teamName) => teamName in playerNames;

export default playerNames;
