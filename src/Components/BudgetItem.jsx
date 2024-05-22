import React from 'react'

const BudgetItem = ({budgets}) => {
    //Prevent the need to repeatedly type budget.value for every item
    const {id, name, amount, color} = budgets;
  
    return (
    <div className='budget' style={{"--accent": color}} >
        <div className='progress-text'>
        <h2>{name}</h2>
        <p className='budgAmount'>Budget Amount: ${amount}</p>
      </div>
      <progress max={amount} value="100">
        <div className='progress-text'>
            <small>...spent</small>
            <small>...remaining</small>
        </div>
      </progress>
    </div>
  )
}

export default BudgetItem
