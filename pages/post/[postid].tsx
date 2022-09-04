import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@apollo/client'
import { Jelly } from '@uiball/loaders'
import TimeAgo from 'react-timeago'

import { GET_POST_BY_ID } from '../../graphql/queries'
import { ADD_COMMENT } from '../../graphql/mutations'
import Post from '../../components/Post'
import Avatar from '../../components/Avatar'

type FormData = {
  comment: string
}

type Props = {}

export default function PostPage({}: Props) {
  const router = useRouter()
  const { data: session } = useSession()

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, 'getPostById'],
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async ({ comment }) => {
    // Add post comment
    const notification = toast.loading('Creating new comment...')

    try {
      const {
        data: { insertComment: newComment },
      } = await addComment({
        variables: {
          comment,
          post_id: router.query.postid,
          username: session?.user?.name,
        },
      })

      console.log('newComment :>> ', newComment)

      reset()

      toast.success('New comment created', { id: notification })
    } catch (error) {
      console.error('error :>> ', error)
      toast.error('Something went error', { id: notification })
    }
  }

  const { loading, data } = useQuery(GET_POST_BY_ID, {
    variables: { id: router.query.postid },
  })

  const post: Post = data?.getPostById

  if (!post || loading) {
    return (
      <div className="flex justify-center items-center w-full p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )
  }
  console.log(post?.comments)
  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />

      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
        <textarea
          {...register('comment', { required: true })}
          disabled={!session}
          className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none"
          placeholder={
            session ? 'What are your thoughts' : 'Please sign in to comment'
          }
        />
        <button
          disabled={!watch('comment')}
          className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
        >
          Comment
        </button>
      </form>
      <div className="-my-5 rounded-b-md border border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />

        {post?.comments?.map((comment) => (
          <div
            key={comment.id}
            className="relative flex items-center space-x-2 space-y-5"
          >
            <hr className="absolute top-10 h-16 border left-7 z-0" />
            <div className="z-50">
              <Avatar seed={comment.username} />
            </div>

            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600 pr-2">
                  {comment.username}
                </span>
                <span>
                  <TimeAgo date={comment.created_at} />
                </span>
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
