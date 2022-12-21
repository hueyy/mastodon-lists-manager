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
  const { lists, following, fetchData, isFetching, getLists, addToList, lastUpdated } = useListsFollowingData()
  const { apiURL, accessToken } = getRequestEssentials()

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
    const accountIds = Object.entries(rowSelection).filter(([_, value]) => value === true).map(([key]) => {
      return unlistedAccounts[Number.parseInt(key)].id
    })
    setIsExecuting(true)
    Promise.all(selectedLists.map(listID => Mastodon.addToList(apiURL, accessToken, listID, accountIds)))
      .catch(error => {
        console.error(error)
        window.alert(`Failed to execute!`)
      })
    addToList(selectedLists, accountIds)
    setSelectedLists([])
    setRowSelection({})
    setIsExecuting(false)
  }, [rowSelection, selectedLists, apiURL, accessToken, unlistedAccounts, addToList])
  
  const onCreateList = React.useCallback(async () => {
    const answer = window.prompt(`What do you want to name your new list`)
    if(typeof answer === `string`){
      await Mastodon.createList(apiURL, accessToken, answer)
      getLists(apiURL, accessToken)
    }
  }, [getLists, apiURL, accessToken])
  
  return (
    <Container>
      <SecondaryButton onClick={fetchData}>Re-fetch data</SecondaryButton>
      <small>Last updated: {lastUpdated === null ? `never` : lastUpdated?.toLocaleString()}</small>

      <h2 className="mt-4">
        Accounts you follow that are not in any list ({unlistedAccounts.length}):
      </h2>

      <div className="my-4 p-4 bg-neutral-100">
        <small className="font-bold">ACTIONS</small>
        <div className="mt-2">
          <p>Add to:</p>
          <div className="grid grid-cols-4">
            {lists.map(list => {
              const onChange = () => selectedLists.includes(list.id)
                  ? setSelectedLists(selectedLists.filter(l => l !== list.id))
                  : setSelectedLists([...selectedLists, list.id])
              const href = `${apiURL}/lists/${list.id}`
              return (
                <div className="flex gap-2 cursor-pointer p-2" onClick={onChange} key={list.id}>
                  <label className="cursor-pointer">
                    <a href={href} target="_blank" rel="noreferrer">
                      {list.title}
                    </a>
                  </label>
                  <CheckBox
                    checked={selectedLists.includes(list.id)}
                  />
                </div>
              )
            })}
            <SecondaryButton onClick={onCreateList}>
              ➕ New List
            </SecondaryButton>
          </div>
          <PrimaryButton className="mt-2" onClick={onClickExecute} isLoading={isExecuting} loadingText="EXECUTING...">
            EXECUTE
          </PrimaryButton>
        </div>
      </div>

      {
        isFetching
          ? (<p>Fetching data...</p>)
          : null
      }
      <ListTable className="block overflow-scroll h-full" table={table} />
    </Container>
  )
}

export default ListsManage