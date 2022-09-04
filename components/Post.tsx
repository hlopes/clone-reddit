import React, { useEffect, useState } from 'react'
import Timeago from 'react-timeago'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleBottomCenterIcon,
  GiftIcon,
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'

import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutations'
import Avatar from './Avatar'

type Props = {
  post: Post
}

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>()

  const { data: session } = useSession()

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: { id: post.id },
  })
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID],
  })

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesListByPostId
    const displayNumber = votes?.reduce(
      (total, vote) => (vote?.upvote ? total++ : total--),
      0
    )

    if (!votes || votes.length === 0) {
      return 0
    }

    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1
    }

    return displayNumber
  }

  const upVote = async (isUpvote: boolean = false) => {
    if (!session) {
      toast.error('You will need to sign in to Vote')
      return
    }

    if ((vote && isUpvote) || (!vote && !isUpvote)) {
      return
    }

    const notification = toast.loading('Creating the vote')

    try {
      await addVote({
        variables: {
          upvote: isUpvote,
          post_id: post.id,
          username: session?.user?.name,
        },
      })

      toast.success('Vote created!', { id: notification })
    } catch (e) {
      toast.error('Something went wrong while creating vote', {
        id: notification,
      })
    }
  }

  useEffect(() => {
    if (loading) {
      return
    }

    const votes: Vote[] = data?.getVotesListByPostId
    const vote = votes.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote

    setVote(vote)
  }, [data, loading])

  return (
    <Link href={`/post/${post.id}`}>
      <article className="rounded-md flex cursor-pointer border border-gray-300 bg-white hover:border hover:border-gray-600">
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          {/* Votes */}
          <ArrowUpIcon
            className={`voteButton hover:text-red-400 ${
              vote && 'text-red-400'
            }`}
            onClick={(event) => {
              event.stopPropagation()
              upVote(true)
            }}
          />
          <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
          <ArrowDownIcon
            className={`voteButton hover:text-blue-400 ${
              !vote && 'text-blue-400'
            }`}
            onClick={(event) => {
              event.stopPropagation()
              upVote(false)
            }}
          />
        </div>
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddit[0]?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit[0].topic}`}>
                <span className="font-bold text-black hover:text-blue-400">
                  r/{post.subreddit[0]?.topic}
                </span>
              </Link>
              <span>
                - Posted by u/{post.username}
                <Timeago date={post.created_at} />
              </span>
            </p>
          </div>
          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.title}</p>
          </div>

          {/* Image */}
          <img className="w-full" src={post.image} alt="" />

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButton">
              <ChatBubbleBottomCenterIcon className="w-6 h-6" />
              <p className="">{post.comments.length} Comments</p>
            </div>
            <div className="postButton">
              <GiftIcon className="w-6 h-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButton">
              <ShareIcon className="w-6 h-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButton">
              <BookmarkIcon className="w-6 h-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButton">
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default Post
