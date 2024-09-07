
import HomeLayout from './components/Home'
import Navbar from './components/Navbar';
import { Suspense } from 'react';

export default function Home() {
  return (
   <>
   <Suspense>
    <HomeLayout/>
   </Suspense>
   
   <Navbar/>
   </>
  );
}
