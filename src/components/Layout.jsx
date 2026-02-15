import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'

const Layout = () => {
  const { pathname } = useLocation()

  const hideLayout = [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ].includes(pathname)

  return (
    <div className='dark:bg-gray-900'>
      {!hideLayout && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default Layout
