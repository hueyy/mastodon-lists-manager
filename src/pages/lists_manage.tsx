import * as React from "react"
import SecondaryButton from "../components/SecondaryButton"
import CheckBox from "../components/CheckBox"
import PrimaryButton from "../components/PrimaryButton"
import useRedirect from "../hooks/useRedirect"
import useListsFollowingData from "../hooks/useListsFollowingData"
import useListsTable from "../hooks/useListsTable"
import ListTable from "../components/ListTable"
import Mastodon from "../utils/Mastodon"
import { getRequestEssentials } from "../utils/Utils"
import Container from "../components/Container"

const ListsManage = () => {
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedLists, setSelectedLists] = React.useState([] as string[])
  const { lists, following, fetchData, isFetching, getLists, addToList, lastUpdated, removeFromFollowing } = useListsFollowingData()
  const { apiURL, accessToken } = getRequestEssentials()
  const [unfollowAction, setUnfollowAction] = React.useState(false)

  const onRedirectDone = React.useCallback(() => {
    if(lists.length === 0 || following.length === 0){
      fetchData()
    }
  }, [lists, following, fetchData])
  
  useRedirect({ done: onRedirectDone })

  const { table, unlistedAccounts } = useListsTable({
    following,
    lists,
    onRowSelectionChange: setRowSelection,
    rowSelection,
  })

  const [isExecuting, setIsExecuting] = React.useState(false)

  const onClickExecute = React.useCallback(() => {
    if(Object.values(rowSelection).length === 0){
      return
    }

    const accountIds = Object.entries(rowSelection).filter(([_, value]) => value === true).map(([key]) => {
      return unlistedAccounts[Number.parseInt(key)].id
    })
    setIsExecuting(true)

    if(unfollowAction){
      Promise.all(accountIds.map(id => {
        return Mastodon.unfollow(apiURL, accessToken, id)
      }))
      removeFromFollowing(accountIds)
      setUnfollowAction(false)
    } else if(selectedLists.length > 0) {
      Promise.all(selectedLists.map(listID => Mastodon.addToList(apiURL, accessToken, listID, accountIds)))
        .catch(error => {
          console.error(error)
          window.alert(`Failed to execute!`)
        })
      addToList(selectedLists, accountIds)
      setSelectedLists([])
    }
    
    setRowSelection({})
    setIsExecuting(false)
    
  }, [rowSelection, selectedLists, apiURL, accessToken, unlistedAccounts, addToList, unfollowAction, removeFromFollowing])
  
  const onCreateList = React.useCallback(async () => {
    const answer = window.prompt(`What do you want to name your new list`)
    if(typeof answer === `string`){
      await Mastodon.createList(apiURL, accessToken, answer)
      getLists(apiURL, accessToken)
    }
  }, [getLists, apiURL, accessToken])

  const onClickUnfollow = React.useCallback(() => {
    setSelectedLists([])
    setUnfollowAction(val => !val)
  }, [])

  if (isFetching){
    return (
      <Container>
        <p>Fetching data...</p>
      </Container>
    )
  }
  
  return (
    <Container>
      <SecondaryButton onClick={fetchData}>Re-fetch data</SecondaryButton>
      <small className="ml-2">Last updated: {lastUpdated === null ? `never` : lastUpdated?.toLocaleString()}</small>

      <h2 className="mt-4">
        Accounts you follow that are not in any list ({unlistedAccounts.length}):
      </h2>

      <div className="my-4 p-4 bg-neutral-100">
        <small className="font-bold">ACTIONS</small>
        <div className="mt-2">
          <p>Add to:</p>
          <div className="grid grid-cols-4">
            {lists.map(list => {
              const isSelected = selectedLists.includes(list.id)
              const onChange = () => {
                if(isSelected){
                  setSelectedLists(selectedLists.filter(l => l !== list.id))
                } else {
                  setSelectedLists([...selectedLists, list.id])
                }
                setUnfollowAction(false)
              }
              // const href = `${apiURL}/lists/${list.id}`
              const selectedClassName = isSelected ? `bg-violet-200` : `hover:bg-violet-100`
              const className =`flex gap-2 cursor-pointer p-2 border border-solid border-neutral-400 ${selectedClassName}`
              return (
                <div className={className} onClick={onChange} key={list.id}>
                  <label className="cursor-pointer">
                    {list.title} ({list.accounts.length})
                  </label>
                  <CheckBox
                    checked={isSelected}
                  />
                </div>
              )
            })}
            <SecondaryButton onClick={onCreateList}>
              ➕ New List
            </SecondaryButton>
          </div>
          
        </div>
        <div className="mt-2" onClick={onClickUnfollow}>
          <label className="mr-4 cursor-pointer">Unfollow</label>
          <CheckBox
            checked={unfollowAction}
          />
        </div>
        <PrimaryButton className="mt-2" onClick={onClickExecute} isLoading={isExecuting} loadingText="EXECUTING...">
          EXECUTE
        </PrimaryButton>
      </div>

      <ListTable className="block overflow-scroll h-full" table={table} />
    </Container>
  )
}

export default ListsManage