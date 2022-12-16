import type { Account } from "masto"
import * as React from "react"

type Props = {
  account: Account
}

const AccountCard: React.FC<Props> = ({ account }) => {
  return (
    <div className="flex gap-4 items-start">
      <img className="w-28 aspect-square" src={account.avatar} alt={account.displayName} />
      <div>
        <p><strong>{account.displayName}</strong></p>
        <a href={account.url} className="text-blue-700">@{account.acct}</a>
        {/* TODO: mitigate XSS risk */}
        <div className="mt-2 prose prose-a:text-blue-700" dangerouslySetInnerHTML={{ __html: account.note}} />
      </div>
    </div>
  )
}

export default AccountCard