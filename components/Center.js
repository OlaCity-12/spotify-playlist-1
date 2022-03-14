import { ChevronDoubleDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom' 
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs'


const colors = [
    "from-teal-500",
    "from-yellow-500",
    "from-red-500",
    "from-pink-400",
    "from-purple-600",
    "from-orange-200",
    "from-emerald-500",
]



const Center = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])
    

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body)
        }).catch(
            (err) => console.log("ophs Something went south", err)
        )
    }, [spotifyApi, playlistId])


  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
        <header className="absolute top-5 right-8">
            <div className="flex items-center bg-gray-400 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-2 pr-3 font-mono text-slate-300" onClick={signOut} >
                <img className="rounded-full w-10 h-10" src={session?.user.image} alt='' />
                <h2>{session?.user.name}</h2>
                <ChevronDoubleDownIcon className="h-5 w-5" />
            </div>
        </header>

        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} />
            <div>
                <p>PLAYLIST</p>
                <h3 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h3>
            </div>
        </section>
        <Songs />
    </div>
  )
}

export default Center