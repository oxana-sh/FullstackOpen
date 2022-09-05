import { useState} from 'react'
const Statistics = (props) => {
const {good, bad, neutral, total} = props
if (total === 0) {
  return (
    <div>
      <h3>No feedback given</h3>
    </div>
  )
}
 return (
  <div>
    <p>Good: {good}</p>
    <p>Neutral: {neutral}</p>
    <p>Bad: {bad}</p>
    <p>Total : {total}</p> 
    <p>Avarage: {((good * 1) + ( bad * - 1 ) + ( neutral * 0 )) / total}</p> 
    <p>Pozitive: {good / total * 100} %</p>  
     </div>
  )
  
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

   const GoodClick= () => {
    setGood(good + 1)
    setTotal(total + 1)
    }

  const NeutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }
  const BadClick= () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }


  return (
  <div>
      <h1>Give Feedback</h1>  
      <div>
      <button onClick={GoodClick}>Good</button>
      <button onClick={NeutralClick}>Neutral</button>
      <button onClick={BadClick}>Bad</button>      
      </div>
      <h2>Statistic</h2>
     <Statistics  bad = {bad} good= {good} neutral ={neutral}  total = {total}/>    
      </div>
  )
}

export default App
