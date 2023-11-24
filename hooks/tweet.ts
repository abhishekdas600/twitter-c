import { graphqlClient } from "@/clients/api"
import { CreateTweetData } from "@/gql/graphql"
import { createTweetMutation } from "@/graphql/mutation/tweet"
import { getAllTweetsQuery } from "@/graphql/query/tweet"
import { useMutation, useQuery } from "@tanstack/react-query"



export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ["all-tweets"],
        queryFn: () => graphqlClient.request(getAllTweetsQuery)
    })
    return {...query, tweets: query.data?.getAllTweets};
}