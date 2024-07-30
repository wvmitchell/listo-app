"use server"

import Header from "@/app/components/Header"

type SharePageLayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: SharePageLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default Layout
