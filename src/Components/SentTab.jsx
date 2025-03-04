import React from 'react'
import { useSelector } from 'react-redux'

const Sent = () => {
    const baseUrl = useSelector((state) => state.login?.baseUrl);
    const token = localStorage.getItem("token");
  return (
    <div>Sent</div>
  )
}

export default Sent