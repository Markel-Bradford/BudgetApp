import { ArrowUturnLeftIcon, HomeIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react'
import { useRouteError, Link, useNavigate } from 'react-router-dom'

const Error = () => {
  const error = useRouteError();
  const goBack = useNavigate();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false); // Allow the error message to display after timeout
    }, 3000)

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  if (isLoading) {
    return <div className='loadingSpinner'><img src="/BudgetApp/images/spinner.svg" className='spinner' alt="Loading spinner" /></div>;
  }

  return (
    <div className='error'>
      <h1>Whoops! We ran into a problem!</h1>
      <div className='flex-md'>
        <button className='btn--err' onClick={() => goBack(-1)}>
          <ArrowUturnLeftIcon width={20} />
          <span>Go Back</span>
        </button>
        <Link to="/" className='btn--err'>
          <HomeIcon width={20}/>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default Error
