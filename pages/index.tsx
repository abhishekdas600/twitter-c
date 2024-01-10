import React, { useCallback, useState } from "react"
import Image from 'next/image'
import {GoImage} from "react-icons/go"
import FeedCard from "@/components/FeedCard"
import { useCurrentUser } from "@/hooks/user"
import { useCreateTweet } from "@/hooks/tweet"
import { Tweet } from "@/gql/graphql"
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { GetServerSideProps } from "next"
import { graphqlClient } from "@/clients/api"
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface HomeProps {
  tweets?: Tweet[]
}

export default function Home(props: HomeProps) {

  const {user} = useCurrentUser();
  const {mutate} = useCreateTweet();

  const [imageUrl, setImageURL] = useState("");
  const [content, setContent] = useState("");
  
  const handleInputChangeFile = useCallback((input: HTMLInputElement)=> {
    return async(event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if(!file) return; 

      const {getSignedURLForTweet} = await graphqlClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type
      })

      if(getSignedURLForTweet){
        toast.loading('Uploading...', {id: '2'});
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file.type
          }
        })
        toast.success('Upload Completed', {id: '2'});
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath)
      }
      
    }
  }, [])
  
  const handleSelectImage = useCallback(()=>{
    const input = document.createElement('input')
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    const handlerFn = handleInputChangeFile(input);

    input.addEventListener('change', handlerFn)

    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(()=>{
    mutate({
      content,
      imageUrl
    })

    setContent("");
    setImageURL("");
    
  },[content, mutate, imageUrl])

   

  return (
   <div>
    <TwitterLayout>
    <div>
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
                 value={content}
                 onChange={(e)=> setContent(e.target.value)}
                 className="w-full bg-transparent text-lg p-3 border-b border-slate-700 overflow-visible"
                 rows={3}
                 placeholder="What is happening?!">
                 </textarea>
                 {
                  imageUrl && <Image src={imageUrl} alt={"tweet image"} width={300} height={300}/>
                 }
                 <div className="flex justify-between items-center mt-2">
                  <div className="text-cyan-400 hover:bg-slate-700 p-2 rounded-full transition-all" >
                  <GoImage onClick={handleSelectImage}  className="text-xl"/>
                  </div>
                  <div>
                  <button onClick={handleCreateTweet} className="bg-blue-500 rounded-full font-semibold  hover:bg-blue-400 px-4 py-1">Post</button>
                  </div>
                 </div>
              </div>
          </div>}
          <div>
            {props.tweets?.map(tweet => tweet? <FeedCard key={tweet?.id} data = {tweet as Tweet}/>: null)}
           
          </div>
    </div>
    </TwitterLayout>
   </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
   const allTweets = await graphqlClient.request(getAllTweetsQuery)

   return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[]
    },
   };
};

