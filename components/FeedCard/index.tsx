import React from "react";
import Image from "next/image";
import {BiMessageRounded, BiRepost} from "react-icons/bi"
import {AiOutlineHeart} from "react-icons/ai"
import {FiShare} from "react-icons/fi"
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps{
    data : Tweet
}

const FeedCard: React.FC <FeedCardProps>= ((props)=> {
    const {data} = props 
    return <div className="border-t border-gray-500 p-4 hover:bg-gray-800 cursor-pointer transition-all">
        <div className="grid grid-cols-12">
            <div className="col-span-1">
                {data.author?.profileImageUrl&& <Image src= {data.author?.profileImageUrl} alt="user-avatar" height={45} width={45} className="rounded-full"/>}
            </div>
            <div className="col-span-11 pl-4 ">
                <h5 className="font-semibold">
                    <Link href= {`/${data.author?.id}`}>{data.author?.firstName} {data.author?.lastName}</Link>
                </h5>
                <p >{data.content}</p>
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