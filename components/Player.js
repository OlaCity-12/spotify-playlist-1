import React, { useCallback, useEffect, useState } from 'react'
import useSpotify from '../hooks/useSpotify';
import { useSession } from 'next-auth/react'
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import { useRecoilState } from 'recoil';
import useSongInfo from "../hooks/useSonginfo"
import { SwitchHorizontalIcon, RewindIcon, PlayIcon, FastForwardIcon, ReplyIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid"
import { debounce  } from "lodash"



const Player = () => {

    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(20)

    const songinfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songinfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now playing: ", data.body?.item)
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(20);
        }
    }, [currentTrackIdState, spotifyApi, session])

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false)
            } else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        });
    }


    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {

            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500), []
    );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        <div className="flex items-center space-x-6" >
            <img className="hidden md:inline h-10 w-10" src={songinfo?.album.images?.[0]?.url} />
            <div>
                <h3>{songinfo?.name}</h3>
                <p>{songinfo?.artists?.[0]?.name}</p>
            </div>
        </div>
        <div className="flex items-center justify-evenly">
            <SwitchHorizontalIcon className="button" />
            <RewindIcon className="button" //onClick={() => spotifyApi.skipToPrevious()}
            />

            {isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"  />
            ): (
                <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"  />
            )}

            <FastForwardIcon //onClick={() => spotifyApi.skipToNext()} 
            className="button" />
            <ReplyIcon className="button" />
        </div>
        <div className="flex items-center space-x-4 md:space-x-6 justify-end pr-5">
            <VolumeOffIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
            <input  className="w-14 md:w-28" type="range" value={volume} min={0} max={100} onChange={e => setVolume(Number(e.target.value))} />
            <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
        </div>
    </div>
  )
}

export default Player