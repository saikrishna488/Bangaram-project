
import HomeLayout from './components/home/Home'
import Navbar from './components/Navbar';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <HomeLayout />
      <Navbar />
    </>
  );
}
