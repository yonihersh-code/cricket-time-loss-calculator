<content><![CDATA[import React, { useState, useCallback, useEffect } from 'react';
import { getSituationAnalysis } from './services/geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';
import { MatchDetails } from './types';
const cricketRules = `--- ISEC ADVERSE WEATHER RULES ---
Preamble
Adverse Weather Rules have historically been very confusing for officials, parents and players alike. This revised set of rules is designed to be as simple as possible to interpret. There will be circumstances where either side feels harshly dealt with in terms of the outcome, but the design of these rules is to ensure where possible that both teams get to face the same number of overs, and that a result is most likely to be achieved.
These rules apply to matches stopped by lightning & thunder, bad light and rain. They do not apply to heat as the decision for all heat related matches is a definitive ‘play’ or ‘no play’.
These rules are applicable to ALL age groups and Stages.
One Day Matches
First Innings Time Loss
Any loss of time resulting from Adverse Weather during the time allocated for the first innings results in a decrease in the number of overs for the match of one for every four minutes lost ROUNDED UP – no matter how much time is lost.
The total overs for each team are then recalculated and rounded DOWN.
Second innings time loss
Any loss of time resulting from Adverse Weather during the time allocated for the second innings results in a decrease in the number of overs for the match of one for every four minutes lost ROUNDED DOWN – no matter how much time is lost.
The total overs for the second innings are then recalculated and rounded DOWN.
Results
If the team batting second does not receive the same number of overs as the team batting first, then unless scores are tied or the team batting second has passed the score of the team batting first, the result is a drawn match.
Minimum overs for a ‘match’
For 20 over per team matches, each side must be able to face 10 overs for it to be considered a ‘match’ to be played for points
For 24 over per team matches, each side must be able to face 12 overs for it to be considered a ‘match’ to be played for points
Two Day Matches
First Day time loss
Any loss of time resulting from Adverse Weather during the first day results in a decrease in the number of overs for the match of one for every four minutes lost ROUNDED UP no matter how much time is lost – unless the entire first day is lost.
The total overs for each team are then recalculated and rounded DOWN.
Entire first day lost
Day 2 becomes a one day fixture played under normal one day rules.
Second Day time loss
Any loss of time resulting from Adverse Weather during the time allocated for the second day results in a decrease in the number of overs for the match of one for every four minutes lost ROUNDED DOWN – no matter how much time is lost.
The total overs for the second innings are then recalculated and rounded DOWN.
Any time lost is taken from the number of overs available for the team batting second to score enough runs to complete a victory.
Results
If the team batting second does not receive their full allocation of revised overs on the second day, then unless scores are tied or the team batting second has passed the score of the team batting first, the result is a drawn match.
Minimum overs for a ‘match’
For 40 over per team matches, each side must be able to face 10 overs for it to be considered a ‘match’ to be played for points
For 45 over per team matches, each side must be able to face 12 overs for it to be considered a ‘match’ to be played for points
--- END OF RULES ---
`;
const App: React.FC = () => {
const [details, setDetails] = useState<MatchDetails>({
matchFormat: 'one-day',
oversPerTeam: '20',
timeLost: '30',
interruptionPoint: 'first-innings',
oversBowled: '10',
});
const [result, setResult] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setDetails(prev => ({ ...prev, [name]: value }));
};
useEffect(() => {
setDetails(prev => {
if (prev.matchFormat === 'one-day' && !['first-innings', 'second-innings'].includes(prev.interruptionPoint)) {
return { ...prev, interruptionPoint: 'first-innings' };
}
if (prev.matchFormat === 'two-day' && !['first-day', 'second-day'].includes(prev.interruptionPoint)) {
return { ...prev, interruptionPoint: 'first-day' };
}
return prev;
});
}, [details.matchFormat]);
const handleAnalysis = useCallback(async () => {
setIsLoading(true);
setError(null);
setResult(null);
code
Code
const detailsText = `
--- MATCH DETAILS ---
Match Type: ${details.matchFormat === 'one-day' ? 'One Day' : 'Two Day'}, ${details.oversPerTeam} overs per team
Time Lost: ${details.timeLost} minutes
Interruption during: ${
{
'first-innings': 'First Innings',
'second-innings': 'Second Innings',
'first-day': 'First Day',
'second-day': 'Second Day',
}[details.interruptionPoint]
}
Overs Bowled (if any): 
{cricketRules}\n${detailsText}`;
code
Code
try {
  const analysisResult = await getSituationAnalysis(situation);
  setResult(analysisResult);
} catch (e: any) {
  setError(e.message || 'An unknown error occurred.');
  console.error(e);
} finally {
  setIsLoading(false);
}
}, [details]);
const inputClass = "w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300";
return (
<div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
<div className="container mx-auto max-w-4xl">
<header className="text-center mb-8">
<div className="inline-block bg-emerald-500/10 p-2 rounded-full mb-2">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-emerald-400">
<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
</div>
<h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
Cricket Time-Loss Calculator
</h1>
<p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
Get an instant, AI-powered decision for any rain-affected match. Just fill in your current match details below.
</p>
</header>
code
Code
{error && (
      <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-center">
        <strong>Error:</strong> {error}
      </div>
    )}

    <main className="bg-gray-800/50 backdrop-blur-sm border border-emerald-400/20 rounded-2xl shadow-2xl p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-emerald-300 mb-4">Enter Match Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="matchFormat" className="block text-sm font-medium text-gray-300 mb-1">Match Format</label>
          <select id="matchFormat" name="matchFormat" value={details.matchFormat} onChange={handleInputChange} className={inputClass}>
            <option value="one-day">One Day</option>
            <option value="two-day">Two Day</option>
          </select>
        </div>
        <div>
          <label htmlFor="oversPerTeam" className="block text-sm font-medium text-gray-300 mb-1">Overs per Team</label>
          <input type="number" id="oversPerTeam" name="oversPerTeam" value={details.oversPerTeam} onChange={handleInputChange} className={inputClass} placeholder="e.g., 20" />
        </div>
        <div>
          <label htmlFor="timeLost" className="block text-sm font-medium text-gray-300 mb-1">Time Lost (minutes)</label>
          <input type="number" id="timeLost" name="timeLost" value={details.timeLost} onChange={handleInputChange} className={inputClass} placeholder="e.g., 30" />
        </div>
        <div>
            <label htmlFor="interruptionPoint" className="block text-sm font-medium text-gray-300 mb-1">Interruption Point</label>
            <select id="interruptionPoint" name="interruptionPoint" value={details.interruptionPoint} onChange={handleInputChange} className={inputClass}>
              {details.matchFormat === 'one-day' ? (
                <>
                  <option value="first-innings">First Innings</option>
                  <option value="second-innings">Second Innings</option>
                </>
              ) : (
                <>
                  <option value="first-day">First Day</option>
                  <option value="second-day">Second Day</option>
                </>
              )}
            </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="oversBowled" className="block text-sm font-medium text-gray-300 mb-1">Overs Bowled Before Stoppage (if any)</label>
          <input type="number" id="oversBowled" name="oversBowled" value={details.oversBowled} onChange={handleInputChange} className={inputClass} placeholder="e.g., 10" />
        </div>
      </div>
      <button
        onClick={handleAnalysis}
        disabled={isLoading}
        className="mt-6 w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Situation...
          </>
        ) : 'Get Answer'}
      </button>
    </main>

    {(isLoading || result) && (
      <section className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-emerald-400/20 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-emerald-300 mb-4">Recommendation</h2>
        {isLoading && !result && (
          <div className="flex items-center text-gray-300">
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce"></div>
            <span className="ml-2">AI is processing...</span>
          </div>
        )}
        {result && <MarkdownRenderer content={result} />}
      </section>
    )}
  </div>
</div>
);
};
export default App;
]]></content>
