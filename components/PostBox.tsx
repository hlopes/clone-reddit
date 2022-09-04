import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { PhotoIcon, LinkIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@apollo/client'
import { toast } from 'react-hot-toast'

import client from '../apollo-client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { GET_ALL_POSTS, GET_SUBREDDITS_BY_TOPIC } from '../graphql/queries'

import Avatar from './Avatar'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}
type Props = {
  subreddit?: string
}

function PostBox({ subreddit }: Props) {
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>()

  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)

  const { data: session, status } = useSession()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('Creating new post...')

    try {
      const image = formData.postImage || ''

      // query for the subreddit topic
      const {
        data: { getSubredditsListByTopic },
      } = await client.query({
        query: GET_SUBREDDITS_BY_TOPIC,
        variables: { topic: formData.subreddit ?? subreddit },
      })

      const subredditFound = getSubredditsListByTopic.length > 0

      if (!subredditFound) {
        // create subreddit
        console.log('New subreditt ')
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({ variables: { topic: formData.subreddit } })

        // create post

        const {
          data: { insertPosts: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: image,
            username: session?.user?.name,
            subreddit_id: newSubreddit.id,
          },
        })

        console.log('newPost :>> ', newPost)
      } else {
        // use existing one
        // create post

        const {
          data: { insertPosts: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: image,
            username: session?.user?.name,
            subreddit_id: getSubredditsListByTopic[0].id,
          },
        })

        console.log('newPost :>> ', newPost)
      }

      //   After post has been created
      reset()

      toast.success('New post created', { id: notification })
    } catch (error) {
      console.error('error :>> ', error)
      toast.error('Something went error', { id: notification })
    }
  })

  if (status === 'loading') {
    return null
  }

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-50"
          disabled={!session}
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title!'
              : 'Sign in to post'
          }
        />
        <PhotoIcon
          onClick={() =>
            setImageBoxOpen((prevState) => !!watch('postTitle') && !prevState)
          }
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && 'text-blue-300'
          }`}
        />
        <LinkIcon className="h-6 text-gray-300 cursor-pointer" />
      </div>

      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90x]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              type="text"
              placeholder="Text (optional)"
              {...register('postBody')}
            />
          </div>
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90x]">Subreddit:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="i.e. reactjs"
                {...register('subreddit', { required: true })}
              />
            </div>
          )}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90x]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="Optional..."
                {...register('postImage')}
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>- A Post title is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>- A subreddit is required</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button className="w-full rounded-full bg-blue-400 p-2 text-white">
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
