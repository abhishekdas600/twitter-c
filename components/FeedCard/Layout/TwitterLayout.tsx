import React, { useCallback } from "react";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { GoBell } from "react-icons/go";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdHomeFilled, MdOutlineMailOutline } from "react-icons/md";
import { RiSearchLine, RiTwitterXFill } from "react-icons/ri";
import { useCurrentUser } from "@/hooks/user";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface TwitterLayoutProps {
    children: React.ReactNode
}
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

const TwitterLayout: React.FC<TwitterLayoutProps>= (props) => {

    const {user} = useCurrentUser(); 
    const queryClient = useQueryClient();   
    const handleLoginWithGoogle = useCallback(async (cred : CredentialResponse) => {
        const googleToken = cred.credential
        if(!googleToken){
          return toast.error('Google token not found');
        }
        const {verifyGoogleToken} = await graphqlClient.request(verifyUserGoogleTokenQuery, {token : googleToken});
        toast.success('Verified Success')
        console.log(verifyGoogleToken);
    
        if(verifyGoogleToken) {
          window.localStorage.setItem('twitter_token', verifyGoogleToken);
        }
        await queryClient.invalidateQueries({queryKey: ["current-user"]});
      },[queryClient])
    

    return (
        <div>
           <div>
      <div className='  grid grid-cols-12 h-screen w-screen '>
        <div className='col-span-2 sm:col-span-4  pt-5 flex justify-end '>
          
          <div className="mt-1 text-2xl  pl-2 ">
          <div className=' text-3xl hover:bg-slate-600 rounded-full h-fit w-fit p-2 pl-5 sm:pl-0 cursor-pointer transition-all'>
          <RiTwitterXFill />
          </div>
            <ul>
            {sidebarMenuItems.map(item => {
              return (
                <li className="flex justify-start items-center gap-5  hover:bg-slate-600 rounded-full h-fit w-fit py-2 pl-5 sm:pl-2 pr-2 sm:pr-7 cursor-pointer transition-all " key={item.title}><span>{item.icon}</span><span className="hidden sm:inline">{item.title}</span></li>
              )
            })}
            </ul>
            <button className="hidden sm:block bg-blue-500  py-3 rounded-full mt-4 mb-20 w-[74%] font-semibold  hover:bg-blue-400">Post</button>
            <button className="block sm:hidden ml-2 sm:ml-0 bg-blue-500  p-3 rounded-full mt-4 mb-20  font-semibold  hover:bg-blue-400"><RiTwitterXFill /></button>
            {user && <div className="pr-5 sm:pr-0 mt-20  flex  gap-3 px-2  py-3 rounded-full text-xl hover:bg-slate-700 cursor-pointer transition-all">
          {user && user.profileImageUrl &&
          <Image className=" rounded-full "
          src={user?.profileImageUrl} 
          alt="User-image" 
          height={50} 
          width={50}/> }
          <h3 className="hidden sm:inline">{user.firstName} {user.lastName}</h3>
         </div>}  
          </div>
         
        
          
        </div>
        <div className='col-span-10 sm:col-span-6 lg:col-span-4 border-[1px] border-gray-500 overflow-y-scroll no-scrollbar'>
            {props.children}
        </div>
        <div className='hidden lg:col-span-4 '>
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

export default TwitterLayout;