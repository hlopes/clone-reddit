import { gql } from '@apollo/client'

const GET_SUBREDDITS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditsListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostsList {
      id
      subreddit_id
      body
      created_at
      image
      title
      username
      subreddit {
        topic
        id
        created_at
      }
      votes {
        id
        upvote
        created_at
      }
      comments {
        id
        text
        username
      }
    }
  }
`

const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostsListByTopic(topic: $topic) {
      id
      subreddit_id
      body
      created_at
      image
      title
      username
      subreddit {
        topic
        id
        created_at
      }
      votes {
        id
        upvote
        created_at
      }
      comments {
        id
        text
        username
      }
    }
  }
`

const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery($id: ID!) {
    getVotesListByPostId(id: $id) {
      id
      post_id
      upvote
      created_at
      username
    }
  }
`

const GET_POST_BY_ID = gql`
  query MyQuery($id: ID!) {
    getPostById(id: $id) {
      id
      subreddit_id
      body
      created_at
      image
      title
      username
      subreddit {
        topic
        id
        created_at
      }
      votes {
        id
        upvote
        created_at
      }
      comments {
        id
        text
        username
        created_at
      }
    }
  }
`

const GET_SUBREDDITS_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getSubredditsWithLimit(limit: $limit) {
      id
      created_at
      topic
    }
  }
`

export {
  GET_SUBREDDITS_BY_TOPIC,
  GET_ALL_POSTS,
  GET_ALL_POSTS_BY_TOPIC,
  GET_POST_BY_ID,
  GET_ALL_VOTES_BY_POST_ID,
  GET_SUBREDDITS_WITH_LIMIT,
}
