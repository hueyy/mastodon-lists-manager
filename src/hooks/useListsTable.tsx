import * as React from "react"
import { useReactTable, createColumnHelper, getCoreRowModel } from "@tanstack/react-table"
import AccountCard from "../components/AccountCard"
import type { Account, List } from "masto"
import CheckBox from "../components/CheckBox"

const columnHelper = createColumnHelper<{ account: Account }>()

const columns = [
  columnHelper.display({
    cell: ({ row }) => (
      <CheckBox
        className="m-4"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    id: `selected`,
  }),
  columnHelper.accessor(row => row.account, {
    cell: (info) => {
      const { row } = info
      const account = info.getValue()
      return (
        <AccountCard
          className="px-4 py-2"
          account={account}
          onClick={row.getToggleSelectedHandler()}
        />
      )
    },
    id: `account`,
  }),
]

interface ListWithAccount extends List {
  accounts: Account[]
}

const useListsTable = ({
  lists,
  following,
  rowSelection,
  onRowSelectionChange,
}: {
  lists: ListWithAccount[],
  following: Account[],
  rowSelection: {},
  onRowSelectionChange: Function,
}) => {
  const unlistedAccounts = React.useMemo(() => {
    const listedAccounts = lists.flatMap(l => l.accounts).map(a => a.id)
    return following.filter(following => !listedAccounts.includes(following.id))
  }, [lists, following])

  const tableData = React.useMemo(() => {
    return unlistedAccounts.map(account => ({
      account,
    }))
  }, [unlistedAccounts])
  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: onRowSelectionChange as any,
    state: {
      rowSelection,
    },
  })

  return { table, unlistedAccounts }
}

export default useListsTable