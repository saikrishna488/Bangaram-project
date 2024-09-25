import React from 'react'
import AdminAuth from '../components/AdminAuth'
import AdminUser from '../components/AdminUser'
import AdminTask from '../components/AdminTask'

const page = () => {
  return (
    <>
    <AdminAuth/>
    <AdminUser/>
    <AdminTask/>
    </>
  )
}

export default page