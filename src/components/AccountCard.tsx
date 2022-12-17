import type { Account } from "masto"
import * as React from "react"

type Props = {
  className?: string,
  account: Account,
  onClick: (event: React.MouseEvent) => void
}

const AccountCard: React.FC<Props> = ({
  className = ``,
  account,
  onClick,
}) => {
  const onClickCard = React.useCallback((event: React.MouseEvent) => {
    onClick(event)
  }, [onClick])
  return (
    <div className={`flex gap-4 items-start cursor-pointer ${className}`} onClick={onClickCard}>
      <img className="w-28 aspect-square" src={account.avatar} alt={account.displayName} />
      <div>
        <p><strong>{account.displayName}</strong></p>
        <a
          href={account.url}
          target="_blank" rel="noreferrer"
        >@{account.acct}</a>
        {/* TODO: mitigate XSS risk */}
        <div className="mt-2 prose prose-a:text-blue-700" dangerouslySetInnerHTML={{ __html: account.note}} />
      </div>
    </div>
  )
}

export default AccountCard