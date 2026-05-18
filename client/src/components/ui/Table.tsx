import React from 'react';

export interface TableColumn<T> {
  key: string;
  title: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
}

export const Table = <T,>({ columns, data }: TableProps<T>) => (
  <div className="overflow-x-auto rounded-xl border border-white/10 bg-dark-900/50">
    <table className="min-w-full text-left">
      <thead className="bg-white/5">
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dark-300">
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t border-white/5">
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3 text-sm text-dark-100">
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
