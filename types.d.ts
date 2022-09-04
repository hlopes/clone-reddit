type Commentary = {
  created_at: string
  id: number
  post_id: number
  text: string
  username: string
}

type Vote = {
  created_at: string
  id: number
  post_id: number
  upvote: boolean
  username: string
}

type Subreddit = {
  created_at: string
  id: number
  topic: string
}

type Post = {
  created_at: string
  id: number
  body: string
  image: string
  subreddit_id: number
  title: string
  username: string
  votes: Vote[]
  comments: Commentary[]
  subreddit: Subreddit[]
}
