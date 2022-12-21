import * as React from "react"
import Storage from "../utils/Storage"
import { login } from "masto"
import type { Account, List } from "masto"
import { getRequestEssentials } from "../utils/Utils"

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

const useListsFollowingData = () => {
  const [lists, setLists] = React.useState(Storage.User.get(`lists`, []) as ListWithAccount[])
  const [following, setFollowing] = React.useState(Storage.User.get(`following`, []) as Account[])
  const [isFetching, setIsFetching] = React.useState(false)
  const [lastUpdated, setLastUpdated ] = React.useState<null | Date>(null)

  const getLists = React.useCallback(async (apiURL: string, accessToken: string) => {
    const m = await login({ accessToken, url: apiURL })
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

  const getFollowing = React.useCallback(async (apiURL: string, accessToken: string) => {
    const m = await login({ accessToken, url: apiURL })
    const self = await m.accounts.verifyCredentials()
    const followingIterator = m.accounts.iterateFollowing(self.id, { limit: 10000 })
    const followingData = await toArray(followingIterator)
    setFollowing(followingData)
    Storage.User.set(`following`, followingData)
  }, [])

  const fetchData = React.useCallback(() => {
    const { apiURL, accessToken } = getRequestEssentials()
    setIsFetching(true);
    (async () => {
      await Promise.all([
        getLists(apiURL, accessToken),
        getFollowing(apiURL, accessToken),
      ])
      setIsFetching(false)
      setLastUpdated(new Date())
    })()
  }, [getLists, getFollowing])

  const addToList = React.useCallback((selectedLists: string[], accountIds: string[]) => {
    setLists(lists.map(list => {
      if(selectedLists.includes(list.id)){
        return { ...list, accounts: [
          ...list.accounts,
          ...following.filter(f => accountIds.includes(f.id)),
        ] }
      }
      return list
    }))
  }, [lists, following])

  return {
    addToList,
    fetchData,
    following,
    getLists,
    isFetching,
    lastUpdated,
    lists,
  }
}

export default useListsFollowingData