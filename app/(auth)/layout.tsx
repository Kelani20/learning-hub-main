const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-full bg-grid-faint">
      {children}
    </div>
  );
}
 
export default AuthLayout;
