import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'

import { GET_SUBREDDITS_WITH_LIMIT } from '../graphql/queries'

import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import Subreddit from '../components/Subreddit'

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDITS_WITH_LIMIT, {
    variables: { limit: 10 },
  })
  const subreddits: Subreddit[] = data?.getSubredditsWithLimit

  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Head>
        <title>Clone reddit</title>
      </Head>

      {/* Post Box */}
      <PostBox />

      <div className="flex">
        <Feed />

        <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md md-1 p-4 pb-3 font-bold">Top Communities</p>

          <div>
            {/* List subreddits */}
            {subreddits?.map((subreddit, index) => (
              <Subreddit
                key={subreddit.id}
                index={index}
                subreddit={subreddit}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
