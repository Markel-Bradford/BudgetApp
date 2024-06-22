import { ArrowUturnLeftIcon, HomeIcon } from '@heroicons/react/24/solid';
import React from 'react'
import { useRouteError, Link, useNavigate } from 'react-router-dom'

const Error = () => {
  const error = useRouteError();
  const goBack = useNavigate()

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
