import React from "react";
import Image from "next/image";
import {BiMessageRounded, BiRepost} from "react-icons/bi"
import {AiOutlineHeart} from "react-icons/ai"
import {FiShare} from "react-icons/fi"

const FeedCard: React.FC = (()=> {
    return <div className="border-t border-gray-500 p-4 hover:bg-gray-800 cursor-pointer transition-all">
        <div className="grid grid-cols-12">
            <div className="col-span-1">
                <Image src= "https://lh3.googleusercontent.com/a/ACg8ocKgP0A0PRkrva8HVt1jQQEPNn8WGHQMQihvrnTermuw_F4=s360-c-no" alt="user-avatar" height={45} width={45} className="rounded-full"/>
            </div>
            <div className="col-span-11 pl-4 ">
                <h5 className="font-semibold">Abhishek Das</h5>
                <p >you know how we do over at sentinels LETS DO IT YES? OR NO ? THOUGHTS ? PLAYING ? MAYBEEEE AT OPFFICE? YES.. WANT HER? OFC NEED HER? NO SHE NEED ME WE UP THEY DOWN (schizo) DEF !!! twitch . tv / zellsis</p>
                <div className="flex justify-between text-lg  mt-2 pr-9 items-center">
                    <div className="rounded-full p-1 hover:bg-slate-500 transition-all">
                        <BiMessageRounded />
                    </div>
                    <div className="rounded-full p-1 hover:bg-slate-500 transition-all">
                        <BiRepost />
                    </div>
                    <div className="rounded-full p-1 hover:bg-slate-500 transition-all">
                        <AiOutlineHeart />
                    </div>
                    <div className="rounded-full p-1 hover:bg-slate-500 transition-all">
                        <FiShare />
                    </div>
                </div>
                
            </div>
        </div>
    </div>
})

export default FeedCard;