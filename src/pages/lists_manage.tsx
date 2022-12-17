import * as React from "react"
import { navigate } from "gatsby"
import Storage from "../utils/Storage"
import { isValidString, makeAPIURL } from "../utils/Utils"
import { login } from "masto"
import type { Account, MastoClient, List } from "masto"
import { useReactTable, flexRender, createColumnHelper, getCoreRowModel } from "@tanstack/react-table"
import SecondaryButton from "../components/SecondaryButton"
import AccountCard from "../components/AccountCard"
import CheckBox from "../components/CheckBox"
import PrimaryButton from "../components/PrimaryButton"

const toArray = async <T,>(asyncIterator: AsyncIterable<T[]>): Promise<T[]> => { 
  let array: T[] = [] 
  for await(const i of asyncIterator) {
    array = array.concat(i) 
  }
  return array
}

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

const ListsManage = () => {
  const [lists, setLists] = React.useState(Storage.User.get(`lists`, []) as ListWithAccount[])
  const [followers, setFollowers] = React.useState(Storage.User.get(`followers`, []) as Account[])
  const [selectedLists, setSelectedLists] = React.useState([] as string[])

  const getLists = React.useCallback(async (m: MastoClient) => {
    const listData = await m.lists.fetchAll()
    const accounts = await Promise.all(listData.map(list => {
      return toArray(m.lists.iterateAccounts(list.id))
    }))
    const listWithAccounts = listData.map((list, index) => ({
      ...list,
      accounts: accounts[index],
    }))

    setLists(listWithAccounts)
    Storage.User.set(`lists`, listWithAccounts)
  }, [])

  const getFollowers = React.useCallback(async (m: MastoClient) => {
    const self = await m.accounts.verifyCredentials()
    const followersIterator = m.accounts.iterateFollowing(self.id, { limit: 10000 })
    const followersData = await toArray(followersIterator)
    setFollowers(followersData)
    Storage.User.set(`followers`, followersData)
  }, [])

  const fetchData = React.useCallback((apiURL: string, accessToken: string) => {
    (async () => {
      const m = await login({ accessToken, url: apiURL })
      await Promise.all([
        getLists(m),
        getFollowers(m),
      ])
    })()
  }, [getLists, getFollowers])

  React.useEffect(() => {
    const homeInstance = Storage.User.get(`home_instance`)
    if(!isValidString(homeInstance)) {
      // go back home
      navigate(`/set_instance`)
      return
    }
    if(!isValidString(Storage.User.get(`client_id`)) || !isValidString(Storage.User.get(`client_secret`))){
      // no need to create app, proceed
      navigate(`/client_details`)
    }
    const accessToken = Storage.User.get(`access_token`)
    if (!isValidString(accessToken)) {
      navigate(`/oauth`)
    } else {
      // fetch lists
      const apiURL = makeAPIURL(homeInstance)

      if(lists.length === 0 || followers.length === 0){
        fetchData(apiURL, accessToken)
      }
    }
  }, [followers, lists, fetchData])

  const unlistedAccounts = React.useMemo(() => {
    const listedAccounts = lists.flatMap(l => l.accounts).map(a => a.id)
    return followers.filter(follower => !listedAccounts.includes(follower.id))
  }, [lists, followers])

  const tableData = React.useMemo(() => {
    return unlistedAccounts.map(account => ({
      account,
    }))
  }, [unlistedAccounts])
  const tableInstance = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  })
  
  return (
    <main className="max-w-screen-md h-screen mx-auto py-4">
      <h1>Lists Manager</h1>

      <SecondaryButton>Re-fetch data</SecondaryButton>

      <h2 className="mt-4">
        Accounts you follow that are not in any list ({unlistedAccounts.length}):
      </h2>

      <div className="my-4 p-4 bg-neutral-100">
        <small className="font-bold">ACTIONS</small>
        <div className="mt-2">
          <p>Add to:</p>
          <div className="grid gap-4 grid-flow-col auto-cols-max">
            {lists.map(list => {
              const onChange = () => selectedLists.includes(list.id)
                  ? setSelectedLists(selectedLists.filter(l => l !== list.id))
                  : setSelectedLists([...selectedLists, list.id])
              return (
                <div className="flex gap-2 cursor-pointer" onClick={onChange}>
                  <label className="cursor-pointer">{list.title}</label>
                  <CheckBox
                    checked={selectedLists.includes(list.id)}
                  />
                </div>
              )
            })}
          </div>
          <PrimaryButton className="mt-2">
            EXECUTE
          </PrimaryButton>
        </div>
      </div>

      <table className="block overflow-scroll h-full">
        <thead>
          {
            tableInstance.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {
                  headerGroup.headers.map(column => (
                    <th key={column.id}>
                      {
                        flexRender(
                          column.column.columnDef.header,
                          column.getContext(),
                        )
                      }
                    </th>

                ))}
              </tr>
            ))
          }
        </thead>
        <tbody>
          {
            tableInstance.getRowModel().rows.map((row) => {
              const rowBackgroundClass = row.getIsSelected() ? `bg-neutral-100` : ``
              return (
                <tr key={row.id} className={`hover:bg-neutral-200 ${rowBackgroundClass}`}>
                  {
                    row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id}>
                          {
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </main>
  )
}

export default ListsManage