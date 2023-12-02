import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`#graphql
query VerifyUserGoogleToken($token : String!) {
  verifyGoogleToken(token: $token)
}

`)
export const getCurrentUserQuery = graphql(`#graphql
query GetCurrentUser {
  getCurrentUser{
    id
    profileImageUrl
    email
    firstName
    lastName
    tweets {
      content
      author {
        id
        firstName
        lastName
        profileImageUrl

      }
      id
    }  
  }
}
`)

export const getUserByIdQuery = graphql(`#graphql
query GetUserById($id: ID!) {
  getUserById(id: $id) {
    id
    firstName
    lastName
    profileImageUrl
    tweets {
      id
      content
      author {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
}
`)