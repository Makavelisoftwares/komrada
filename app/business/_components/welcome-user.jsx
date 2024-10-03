export const WelcomeUser = ({ user }) => {
  return (
    <div>
      <div className="font-bold text-xl uppercase">Hello , {user?.name}!</div>
      <div className="text-sm text-zinc-400">Here's whats happening today</div>
    </div>
  );
};
