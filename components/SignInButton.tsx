import { ChevronRightIcon, UserIcon } from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

type Props = {}

export default function SignInButton({}: Props) {
  const { data: session } = useSession()

  return session ? (
    <div
      className="hidden lg:flex items-center space-x-2 border border-gray-100 cursor-pointer"
      onClick={() => signOut()}
    >
      <UserIcon className="icon" />
      <div className="flex">
        <p className="truncate text-xs">{session.user?.name}</p>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-gray-200" />
    </div>
  ) : (
    <div
      className="hidden lg:flex items-center space-x-2 border border-gray-100 cursor-pointer"
      onClick={() => signIn()}
    >
      <UserIcon className="icon" />
      <p className="text-gray-400">Sign In</p>
    </div>
  )
}
