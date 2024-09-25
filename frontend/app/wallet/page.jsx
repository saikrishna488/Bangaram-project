"use client"
import React from 'react'
import WalletPage from '../components/Wallet'
import Navbar from '../components/Navbar';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const page = () => {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/saikrishna488/Bangaram-project/main/manifest.json">
        <WalletPage />
      </TonConnectUIProvider>
      <Navbar />
    </>
  )
}

export default page