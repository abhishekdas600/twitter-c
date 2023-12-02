import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";

import Image from "next/image";

import { GetServerSideProps, NextPage } from "next";
import { FaArrowLeft } from "react-icons/fa6";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import Link from "next/link";

interface ServerProps {
    userInfo? : User;
}

const UserProfilePage: NextPage <ServerProps>= (props) => {

    

   

    return (
        <div>
            <TwitterLayout>
                <div>
                   <nav className="flex gap-4 px-4 py-1 items-center border-b border-slate-600">
                    <Link href = {'/'}><FaArrowLeft  className="text-2xl  rounded-full hover:bg-slate-600 p-1"/></Link>
                    <div className="gap-2">
                    <h1 className="text-xl">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                    <h1 className="text-sm text-slate-400">{props.userInfo?.tweets?.length} Post(s)</h1>
                    </div>
                    
                   </nav>

                   {props.userInfo && <div>
                    { props.userInfo.profileImageUrl&&<Image 
                    className="rounded-full m-4"
                     src={props.userInfo.profileImageUrl}
                     alt="user-image"
                     height={100}
                     width={100}
                     />}
                     <h1 className="text-xl p-4">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                   </div>}
                   <div className="mt-10">
                    { props.userInfo && props.userInfo.tweets && props.userInfo.tweets.map(tweet => tweet? <FeedCard key={tweet.id} data={tweet as Tweet}/>: null )}
                   </div>
                </div>
            </TwitterLayout>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
    const id = context.query.id as string | undefined;

    if(!id) return {notFound: true, props:{userInfo: undefined}};

    const userInfo = await graphqlClient.request(getUserByIdQuery, {id});

    if(!userInfo.getUserById) return {notFound: true };

    return{
        props:{
            userInfo: userInfo.getUserById as User
        },
    }
}

export default UserProfilePage;


