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
    followers {
      firstName
      lastName
      id
      email
      profileImageUrl
    }
    following {
      firstName
      lastName
      id
      email
      profileImageUrl
    }
    recommendedUsers {
      email
      firstName
      lastName
      profileImageUrl
      id
    }
    tweets {
      content
      imageUrl
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
    followers {
      firstName
      lastName
      id
      email
      profileImageUrl
    }
    following {
      firstName
      lastName
      id
      email
      profileImageUrl
    }
    tweets {
      id
      content
      imageUrl
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