export const ROLE_BRIEFS={
 government:{goal:'Protect security, growth and independence.',cooperate:'More shared security. Less freedom to act alone.',race:'Protect your lead. Your rival may accelerate too.'},
 lab:{goal:'Protect your lab’s lead, jobs and useful discoveries.',cooperate:'More testing time. Slower growth; a rival may overtake.',race:'Earlier progress and revenue. Less time to catch failures.'},
 safety:{goal:'Require evidence and a real way to stop unsafe AI.',cooperate:'More time to test. Your rival may still hide unsafe work.',race:'Faster progress. Important failures may go undetected.'},
 public:{goal:'Protect people’s jobs, rights and safety.',cooperate:'More oversight. Useful services may arrive later.',race:'Useful AI sooner. People face risks they did not choose.'},
 undecided:{goal:'Balance progress and growth with safety.',cooperate:'More shared safeguards. Slower growth; a rival may lead.',race:'Faster growth. Less time to protect people.'}
};
export const ROUND_BRIEFS=[
 'A test finds unexpected behaviour. Keep oversight, or push ahead?',
 'The rival is catching up. Keep oversight, or protect your lead?',
 'AI helps build better AI. Keep human checks, or develop faster?',
 'The next AI step may be hard to reverse. Keep oversight, or race?'
];
export const ROLE_ROUND_CONTEXT={
 "government": [
  "You protect security and growth. Racing may preserve your lead; oversight helps prevent a crisis you would have to manage.",
  "A rival catching up threatens your independence. Oversight takes time, but rushing can leave your government handling failures.",
  "More capable AI could strengthen your side. You must also consider whether people can understand and stop its decisions.",
  "You want your side to stay ahead. People also expect you to protect them from harm they never agreed to accept."
 ],
 "lab": [
  "Your team cannot explain a test result. More testing protects users; delay can cost customers and funding.",
  "Someone may be copying your work. You want to protect your lead. Keeping checks may slow your next release.",
  "AI speeds up your research. Extra review can catch mistakes but costs time your rival may use to move ahead.",
  "Investors expect progress. Keeping oversight can delay useful services; racing can leave costly failures unnoticed."
 ],
 "safety": [
  "A test showed unexpected behaviour. You need time to find out how serious it is.",
  "Competitive pressure is growing. Your task is to explain which checks protect people and what rushing could miss.",
  "AI research is moving faster. You need enough time and access to check the work before people depend on it.",
  "Evidence is incomplete. You want people able to question decisions and stop unsafe use, even if that slows your side."
 ],
 "public": [
  "Useful tools could arrive sooner. Workers and users also face risks before they can prepare.",
  "The labs fear losing their lead. You represent people who never agreed to enter their race.",
  "Faster AI research could bring useful services. People also need a voice over risks to their jobs, data and safety.",
  "Patients and workers want useful AI. You also represent people harmed if they cannot challenge or stop unsafe use."
 ],
 "undecided": [
  "You want useful progress without losing safety. Delay buys testing time, but a rival may pull ahead.",
  "You want your side to stay competitive. Oversight costs time, while rushing could expose people to failures.",
  "Faster research promises growth. Keeping human checks may slow progress but helps catch mistakes.",
  "You balance earlier benefits against control. Your side wants to stay ahead; people need safeguards too."
 ]
};
export const COUNTING_RULES='<details class="compact-details"><summary>How votes are counted</summary><ul><li>One vote per person. Each side decides separately.</li><li>The majority decides Cooperate or Race.</li><li>Government breaks a tie. Without its deciding vote, a tie means Race.</li><li>Your rival cannot see your vote before results.</li></ul></details>';
