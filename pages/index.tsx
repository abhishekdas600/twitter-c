import React, { useCallback } from "react"
import Image from 'next/image'
import {RiSearchLine, RiTwitterXFill} from "react-icons/ri"
import {MdHomeFilled, MdOutlineMailOutline} from "react-icons/md"
import {GoBell, GoImage} from "react-icons/go"
import {HiOutlineClipboardList} from "react-icons/hi"
import {CgProfile} from "react-icons/cg"
import FeedCard from "@/components/FeedCard"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import toast from "react-hot-toast"
import { graphqlClient } from "@/clients/api"
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user"
import { useCurrentUser } from "@/hooks/user"
import { useQueryClient } from "@tanstack/react-query"
import { useGetAllTweets } from "@/hooks/tweet"
import { Tweet } from "@/gql/graphql"


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

  const {user} = useCurrentUser();
  const {tweets = []} = useGetAllTweets();

  const queryClient = useQueryClient();
  
  const handleSelectImage = useCallback(()=>{
    const input = document.createElement('input')
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  }, [])

   const handleLoginWithGoogle = useCallback(async (cred : CredentialResponse) => {
    const googleToken = cred.credential
    if(!googleToken){
      return toast.error('Google token not found');
    }
    const {verifyGoogleToken} = await graphqlClient.request(verifyUserGoogleTokenQuery, {token : googleToken});
    toast.success('Verified Success')
    console.log(verifyGoogleToken);

    if(verifyGoogleToken) {
      window.localStorage.setItem('twitter_clone_token', verifyGoogleToken);
    }
    await queryClient.invalidateQueries({queryKey: ["current-user"]});
  },[queryClient])

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
         <button className="bg-blue-500  py-3 rounded-full mt-4 mb-20 w-[74%] font-semibold  hover:bg-blue-400">Post</button>
         </div>
         {user && <div className="mt-20 ml-10 flex  gap-3 px-3 mr-12 py-3 rounded-full  hover:bg-slate-700 cursor-pointer transition-all">
          {user && user.profileImageUrl &&
          <Image className="rounded-full"
          src={user?.profileImageUrl} 
          alt="User-image" 
          height={50} 
          width={50}/> }
          <h3>{user.firstName} {user.lastName}</h3>
         </div>}  
          
        </div>
        <div className='col-span-5 border-[1px] border-gray-500 overflow-y-scroll no-scrollbar'>
          {user?.profileImageUrl && <div  className="border-t border-gray-500 p-4 hover:bg-gray-800 cursor-pointer transition-all grid grid-cols-12">
              <div className="col-span-1">
                 <Image src={user?.profileImageUrl}
                className="rounded-full"
                alt="User-image" 
                 height={50} 
                  width={50}/>
              </div>
              <div className="col-span-11 pl-4">
                 <textarea 
                 className="w-full bg-transparent text-lg p-3 border-b border-slate-700 overflow-visible"
                 rows={3}
                 placeholder="What is happening?!">
                 </textarea>
                 <div className="flex justify-between items-center mt-2">
                  <div className="text-cyan-400 hover:bg-slate-700 p-2 rounded-full transition-all" >
                  <GoImage onClick={handleSelectImage}  className="text-xl"/>
                  </div>
                  <div>
                  <button className="bg-blue-500 rounded-full font-semibold  hover:bg-blue-400 px-4 py-1">Post</button>
                  </div>
                 </div>
              </div>
          </div>}
          <div>
            {tweets?.map(tweet => tweet? <FeedCard key={tweet?.id} data = {tweet as Tweet}/>: null)}
           
          </div>
        </div>
        <div className='col-span-4 '>
          {!user&&<div className="border p-6 mr-20 mt-5 ml-3 bg-slate-700 rounded-lg">
            <h4>New to Twitter?</h4>
          <GoogleLogin onSuccess={handleLoginWithGoogle}/>
          </div>}
          
        </div>
      </div>
    </div>
    </div>
  )
}

