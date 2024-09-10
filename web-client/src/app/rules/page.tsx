import Header from '@/app/shared/Header';
import Footer from '@/app/shared/Footer';

export default function Rules() {
  return (
    <>
      <Header title='Rules'/>
      <main className="overflow-auto pt-5 px-4 sm:px-44">
        <h2 className="pink font-bold text-2xl ls:text-xl pb-2">Cricket</h2>
        <p className='white pb-5'>This game is based on the sport of cricket. If you are unfamiliar with cricket, visit the following link to get caught up, though you should be fine just reading the rest of this page: <a target="_blank" rel="noopener noreferrer" href='https://en.wikipedia.org/wiki/Cricket' className='underline'>https://en.wikipedia.org/wiki/Cricket</a>.</p>
        <h2 className="pink font-bold text-2xl ls:text-xl pb-2">Gameplay</h2>
        <p className='white pb-5'>Each game features two innings in which one player bats and another bowls. Each inning is composed of a sequence of plays known as balls. During each ball, the batting player selects a number from one to six. The bowling player does the same. Each ball lasts for a maximum of ten seconds after which a move is selected by the game for players that have not yet selected. If the numbers chosen are different, the batting player accumulates the number they put out to their score known as runs, which starts from zero. If the numbers chosen are the same, then the batting player has lost a wicket and is considered out. The batting player has three wickets before their innings is over, and getting out represents losing one wicket. The batting player also has thirty balls before their innings is over. So an end-of-innings occurs when the batting player either has lost all three wickets or thirty balls have been bowled. A no-ball represents an invalid bowl and occurs with a certain probability. No-balls result in the batting player gaining an extra run while their ball and wicket count stays the same (it&apos;s a free run). So if a no-ball has been bowled and the numbers put out by both players are different, then the batting player will gain this additional run alongside what they put out. And if the number put out are the same, then the batting player accumulates a single run and has not lost a wicket. After the first innings concludes, the two players switch roles. The second batter must accumulate more runs than the first batter to win while also having three wickets and thirty balls to do so. If the runs accumulated are equal, then the game is tied. If players drop out of the game, the game will automatically takeover for them. If they rejoin, the player will resume control.</p>
        <h2 className="pink font-bold text-2xl ls:text-xl pb-2">Toss</h2>
        <p className='white pb-5'>The toss starts off the game by determining who bats first. One player is designated even and the other odd. The two players independently select a number from one to six. The sum of the chosen numbers is taken. If even, then the even player gets to choose whether they would like to bat or bowl first, and if odd, then the odd player gets to choose.</p>
        <h2 className="pink font-bold text-2xl ls:text-xl pb-2">Game Modes</h2>
        <p className='white pb-5'>There are two game modes—public and private games. Public games will result in players matching randomly with another player. Private games allow for two friends to play against each other.</p>        
      </main>
      <Footer />
    </>
  );
}
