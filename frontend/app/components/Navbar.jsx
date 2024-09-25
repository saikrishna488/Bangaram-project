import { Home, CheckSquare, Users, Wallet, Award } from 'lucide-react'; // Import Lucide icons
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-black p-4 flex justify-around items-center text-white space-x-4 sm:space-x-8">
      <Link href="/" passHref>
        <div className="flex flex-col items-center cursor-pointer text-center">
          <Home className="text-2xl mb-1 sm:text-3xl" />
          <span className="text-xs sm:text-sm">Home</span>
        </div>
      </Link>
      
      <Link href="/tasks" passHref>
        <div className="flex flex-col items-center cursor-pointer text-center">
          <CheckSquare className="text-2xl mb-1 sm:text-3xl" />
          <span className="text-xs sm:text-sm">Earn</span>
        </div>
      </Link>
      
      <Link href="/referral" passHref>
        <div className="flex flex-col items-center cursor-pointer text-center">
          <Users className="text-2xl mb-1 sm:text-3xl" />
          <span className="text-xs sm:text-sm">Friends</span>
        </div>
      </Link>
      
      <Link href="/leaderboard" passHref>
        <div className="flex flex-col items-center cursor-pointer text-center">
          <Award className="text-2xl mb-1 sm:text-3xl" />
          <span className="text-xs sm:text-sm">Leaderboard</span>
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
