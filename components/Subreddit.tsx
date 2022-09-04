import React from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

import Avatar from './Avatar'
import Link from 'next/link'

type Props = {
  index: number
  subreddit: Subreddit
}

export default function Subreddit({ subreddit, index }: Props) {
  console.log(subreddit)
  return (
    <div className="flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b">
      <p>{index + 1}</p>
      <ChevronUpIcon className="h-4 w-4 flex-shrink-0 text-green-400" />
      <Avatar seed={`/subreddit/${subreddit?.topic}`} />
      <p className="flex-1 truncate">r/{subreddit?.topic}</p>
      <Link href={`/subreddit/${subreddit?.topic}`}>
        <span className="cursor-pointer rounded-full bg-blue-400 text-sm text-white px-3">
          View
        </span>
      </Link>
    </div>
  )
}
