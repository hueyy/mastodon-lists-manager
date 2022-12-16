import * as React from "react"
import { navigate } from "gatsby"
import Storage from "../utils/Storage"
import { isValidString, makeAPIURL } from "../utils/Utils"
import { login } from "masto"
import type { Account, MastoClient, List } from "masto"
import SecondaryButton from "../components/SecondaryButton"
import AccountCard from "../components/AccountCard"

const toArray = async <T,>(asyncIterator: AsyncIterable<T[]>): Promise<T[]> => { 
    let array: T[] = [] 
    for await(const i of asyncIterator) {
      array = array.concat(i) 
    }
    return array
}

interface ListWithAccount extends List {
  accounts: Account[]
}

const ListsManage = () => {
  const [lists, setLists] = React.useState(Storage.User.get(`lists`, []) as ListWithAccount[])
  const [followers, setFollowers] = React.useState(Storage.User.get(`followers`, []) as Account[])

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
  
  return (
    <main className="max-w-screen-md mx-auto py-4">
      <h1>Lists Manager</h1>

      <SecondaryButton>Re-fetch data</SecondaryButton>

      <h2 className="mt-4">
        Accounts you follow that are not in any list ({unlistedAccounts.length})
      </h2>
      <div className="p-4 flex flex-col gap-6">
        {
          unlistedAccounts.map(account => {
            return (
              <div className="flex justify-between items-start gap-4" key={account.id}>
                <AccountCard account={account} />
                <div>
                  <select>
                    
                  </select>
                </div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}

export default ListsManage