//import React from 'react'

function Humanreply({chatdata}) {
    const {message ,sender , session_id , sql_query} = chatdata
  return (
    <div className="bg-blue-200 min-h-[40px] p-4 rounded-lg">{message}</div>
  )
}

export default Humanreply