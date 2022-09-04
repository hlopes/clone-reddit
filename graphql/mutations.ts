import { gql } from '@apollo/client'

const ADD_POST = gql`
  mutation MyMutation(
    $image: String!
    $body: String!
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPosts(
      image: $image
      body: $body
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      image
      body
      subreddit_id
      title
      username
      id
      created_at
    }
  }
`

const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      topic
      id
      created_at
    }
  }
`

const ADD_COMMENT = gql`
  mutation MyMutation($comment: String!, $post_id: ID!, $username: String!) {
    insertComment(text: $comment, post_id: $post_id, username: $username) {
      text
      id
      created_at
    }
  }
`

const ADD_VOTE = gql`
  mutation MyMutation($upvote: Boolean!, $post_id: ID!, $username: String!) {
    insertVote(upvote: $upvote, post_id: $post_id, username: $username) {
      upvote
      id
      created_at
    }
  }
`

export { ADD_POST, ADD_SUBREDDIT, ADD_COMMENT, ADD_VOTE }
