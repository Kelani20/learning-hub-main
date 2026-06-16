import React from 'react'

const LandingLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="mx-auto h-full w-full overflow-auto bg-white dark:bg-slate-950">
      {children}
    </div>
  )
}

export default LandingLayout;
