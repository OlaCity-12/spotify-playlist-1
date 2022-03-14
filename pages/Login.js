import React from 'react'
import { getProviders, signIn } from 'next-auth/react'

const Login = ({ providers }) => {
  return (
    <>
    <div className='bg-gray-900 h-screen w-screen relative overflow-hidden flex flex-col justify-center items-center'>
      <div className='h-full w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full absolute left-2/3 -top-56 animate-pulse'></div>
      <div className='h-full w-full bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 rounded-full absolute right-2/3 -bottom-96 animate-pulse'></div>
      <div className='h-fit w-96 bg-white bg-opacity-10 relative z-2 rounded-2xl shadow-2xl border-opacity-30 backdrop-filter backdrop-blur-sm'>
    <div className='flex flex-col items-center bg-black justify-center'> 
        <img className='w-70 mb-5' 
        src="https://wallpaperaccess.com/full/1836701.jpg"
        />

        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className='bg-[#18D860] text-white p-5 rounded-full'
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >LOGIN WITH {provider.name}</button>
          </div>
        ))}
    </div>
    </div>
    </div>
    </>
  )
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    }
  }
}