import React, { useCallback, useMemo } from "react";
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
import Link from "next/link";

interface TwitterLayoutProps {
    children: React.ReactNode
}
interface TwitterSidebarButton{
    title: string,
    icon: React.ReactNode
    link: string
  }



const TwitterLayout: React.FC<TwitterLayoutProps>= (props) => {
  const {user} = useCurrentUser(); 
    const queryClient = useQueryClient();   
    
  const sidebarMenuItems: TwitterSidebarButton[] = useMemo( () =>
    [
      {
        title: 'Home',
        icon: <MdHomeFilled />,
        link: '/'
      },
      {
        title: 'Explore',
        icon: <RiSearchLine />,
        link: '/'
      },
      {
        title: 'Notifications',
        icon: <GoBell />,
        link: '/'
      },
      {
        title: 'Messages',
        icon: <MdOutlineMailOutline/>,
        link: '/'
      },
      {
        title: 'Lists',
        icon: <HiOutlineClipboardList />,
        link: '/'
      },
      {
        title: 'Profile',
        icon: <CgProfile />,
        link: `/${user?.id}`
      }
    ],[user?.id]
   )
    
    
    const handleLoginWithGoogle = useCallback(async (cred : CredentialResponse) => {
        const googleToken = cred.credential
        if(!googleToken){
          return toast.error('Google token not found');
        }
        const {verifyGoogleToken} = await graphqlClient.request(verifyUserGoogleTokenQuery, {token : googleToken});
        toast.success('Verified Success')
        // console.log(verifyGoogleToken);
    
        if(verifyGoogleToken) {
          window.localStorage.setItem('twitter_clone_token', verifyGoogleToken);
        }
        await queryClient.invalidateQueries({queryKey: ["current-user"]});
      },[queryClient])

      const handleLogout = useCallback(async()=>{
        if(!user) throw new Error("No User Found");
        window.localStorage.removeItem('twitter_clone_token');
        await queryClient.invalidateQueries({queryKey: ["current-user"]});
      },[queryClient, user]);
    

    return (
        <div>
           <div>
      <div className='  grid grid-cols-12 h-screen w-screen '>
        <div className='col-span-2 sm:col-span-4  pt-5 flex justify-end '>
          
          <div className="mt-1 text-2xl  pl-2 ">
          <div className=' text-3xl hover:bg-slate-600 rounded-full h-fit w-fit p-2 pl-5 sm:pl-2 cursor-pointer transition-all'>
          <RiTwitterXFill />
          </div>
            <ul>
            {sidebarMenuItems.map(item => {
              return (
                <li  key={item.title}>
                  <Link className="flex justify-start items-center gap-5  hover:bg-slate-600 rounded-full h-fit w-fit py-2 pl-5 sm:pl-2 pr-2 sm:pr-7 cursor-pointer transition-all "
                  href= {item.link}>
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.title}</span>
                  </Link>
                  </li>
              )
            })}
            </ul>
            <button className="hidden sm:block bg-blue-500  py-3 rounded-full mt-4 mb-20 w-[74%] font-semibold  hover:bg-blue-400">Post</button>
            <button className="block sm:hidden ml-2 sm:ml-0 bg-blue-500  p-3 rounded-full mt-4 mb-20  font-semibold  hover:bg-blue-400"><RiTwitterXFill /></button>
            {user && <div className="pr-5 sm:pr-0 mt-20 mr-4 flex  gap-3 px-2  py-3 rounded-full text-xl hover:bg-slate-700 cursor-pointer transition-all">
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
        <div className='col-span-4 '>
          {!user&&<div className="border p-6 mr-20 mt-5 ml-3 bg-slate-700 rounded-lg">
            <h4>New to Twitter?</h4>
          <GoogleLogin onSuccess={handleLoginWithGoogle}/>
          </div>}
          {
            user&& <div>
              <div>
                <button onClick={handleLogout}>Logout</button>
              </div>
             {user.recommendedUsers && <div className=" mt-7 w-fit rounded-3xl bg-slate-800 p-2 ml-3">
                 <h1 className="ml-3 ">Users you may know</h1>
                
                  <ul>
                   {
                     user.recommendedUsers.map((recUser)=>{
                     return (
                      <li key={recUser?.id} className="flex gap-2 items-center m-2  w-fit p-2  ">
                         { recUser?.profileImageUrl && <Image
                          src={recUser?.profileImageUrl} 
                          alt="profile image" 
                          height={50} 
                          width={50} 
                          className="rounded-full"/>}
                          <span>{recUser?.firstName} {recUser?.lastName}</span>
                          <Link href={`/${recUser?.id}`} className="ml-3 px-2 py-1 bg-blue-600 rounded-full text-sm">View</Link>
                      </li>
                     )
                    }) 
                   }
                    
                  </ul>
                 
              </div>}
            </div>
          }
          
        </div>
      </div>
    </div>
        </div>
    )
}

export default TwitterLayout;