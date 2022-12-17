import * as React from "react"
import type { Table } from "@tanstack/react-table"
import type { Account } from "masto"
import { flexRender } from "@tanstack/react-table"

type Props = {
  className?: string,
  table: Table<{ account: Account }>
}

const ListTable: React.FC<Props> = ({
  className,
  table,
}) => {
  return (
    <table className={className}>
        <tbody>
          {
            table.getRowModel().rows.map((row) => {
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
  )
}

export default ListTable