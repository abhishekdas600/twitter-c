import React, { useCallback } from "react"
import Image from 'next/image'
import {RiSearchLine, RiTwitterXFill} from "react-icons/ri"
import {MdHomeFilled, MdOutlineMailOutline} from "react-icons/md"
import {GoBell} from "react-icons/go"
import {HiOutlineClipboardList} from "react-icons/hi"
import {CgProfile} from "react-icons/cg"
import FeedCard from "@/components/FeedCard"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import toast from "react-hot-toast"
import { graphqlClient } from "@/clients/api"
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user"


interface TwitterSidebarButton{
  title: string,
  icon: React.ReactNode
}

const sidebarMenuItems: TwitterSidebarButton[] =[
  {
    title: 'Home',
    icon: <MdHomeFilled />
  },
  {
    title: 'Explore',
    icon: <RiSearchLine />
  },
  {
    title: 'Notifications',
    icon: <GoBell />
  },
  {
    title: 'Messages',
    icon: <MdOutlineMailOutline/>
  },
  {
    title: 'Lists',
    icon: <HiOutlineClipboardList />
  },
  {
    title: 'Profile',
    icon: <CgProfile />
  }
]

export default function Home() {

   const handleLoginWithGoogle = useCallback(async (cred : CredentialResponse) => {
    const googleToken = cred.credential
    if(!googleToken){
      return toast.error('Google token not found');
    }
    const {verifyGoogleToken} = await graphqlClient.request(verifyUserGoogleTokenQuery, {token : googleToken});
    toast.success('Verified Success')
    console.log(verifyGoogleToken);

    if(verifyGoogleToken) {
      window.localStorage.setItem('twitter_clone_token', verifyGoogleToken)
    }
  },[])

  return (
    <div>
      <div>
      <div className='grid grid-cols-12 h-screen w-screen px-36'>
        <div className='col-span-3  pt-5 '>
          <div className=' text-3xl hover:bg-slate-600 rounded-full h-fit w-fit p-2 cursor-pointer transition-all'>
          <RiTwitterXFill />
          </div>
          <div className="mt-3 text-2xl  pl-2 ">
            <ul>
            {sidebarMenuItems.map(item => {
              return (
                <li className="flex justify-start items-center gap-5  hover:bg-slate-600 rounded-full h-fit w-fit py-2 pl-2 pr-7 cursor-pointer transition-all " key={item.title}><span>{item.icon}</span><span>{item.title}</span></li>
              )
            })}
            </ul>
            
          </div>
         <div>
         <button className="bg-blue-500  py-3 rounded-full mt-4 w-[74%] font-semibold  hover:bg-blue-400">Post</button>
         </div>
           
          
        </div>
        <div className='col-span-5 border-[1px] border-gray-500 '>
          <div>
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
          </div>
        </div>
        <div className='col-span-4 '>
          <div className="border p-6 mr-20 mt-5 ml-3 bg-slate-700 rounded-lg">
            <h4>New to Twitter?</h4>
          <GoogleLogin onSuccess={handleLoginWithGoogle}/>
          </div>
          
        </div>
      </div>
    </div>
    </div>
  )
}

