import { useState } from 'react'

const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({statistic}) => <tr><td>{statistic.text}</td><td>{statistic.value}</td></tr>

const Statistics = ({good, bad, neutral}) => {
  console.log(`Value of good: ${good}`)
  console.log(`Value of neutral: ${neutral}`)
  console.log(`Value of bad: ${bad}`)
  
  const total = good+bad+neutral;
  const average = total == 0 ? 0 : (good-bad)/(good+neutral+bad)
  const positive = total == 0 ? 0 : ((good)/(good+neutral+bad)) * 100

  const statistics = [
    {text: "good", value : good},
    {text: "neutral", value : neutral},
    {text: "bad", value: bad},
    {text: "all", value:total},
    {text: "average", value: average},
    {text: "positive", value: `${positive}%`}
  ]

  console.log(statistics)

  return (
    <>
      <h2>Statistics</h2>
      {total == 0 ? <p>No feedback given</p> :
      <table>
        <tbody>
          <StatisticLine statistic={statistics[0]}/>
          <StatisticLine statistic={statistics[1]}/>
          <StatisticLine statistic={statistics[2]}/>
          <StatisticLine statistic={statistics[3]}/>
          <StatisticLine statistic={statistics[4]}/>
          <StatisticLine statistic={statistics[5]}/>
        </tbody>
      </table>}
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good+1)
  const handleNeutral = () => setNeutral(neutral+1)
  const handleBad = () => setBad(bad+1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} onClick={handleGood}/>
      <Button text={"neutral"} onClick={handleNeutral}/>
      <Button text={"bad"} onClick={handleBad}/>
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

export default App
