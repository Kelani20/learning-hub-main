import React from 'react'

const LandingLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="mx-auto h-full w-full overflow-auto bg-slate-50">
      {children}
    </div>
  )
}

export default LandingLayout;
