const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-full">
      {children}
    </div>
  );
}
 
export default AuthLayout;
