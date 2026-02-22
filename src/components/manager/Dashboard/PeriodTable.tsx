interface PeriodData {
  date: string
  newOrders: number
  revenue: number
  visitors: number
  pageViews: number
}

export function PeriodTable({ data }: { data: PeriodData[] }) {
  const totals = data.reduce(
    (acc, row) => ({
      newOrders: acc.newOrders + row.newOrders,
      revenue: acc.revenue + row.revenue,
      visitors: acc.visitors + row.visitors,
      pageViews: acc.pageViews + row.pageViews,
    }),
    { newOrders: 0, revenue: 0, visitors: 0, pageViews: 0 },
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-100">
            {['일자', '주문수', '매출액', '방문자', '페이지뷰'].map((h) => (
              <th key={h} className="pb-2 text-left text-slate-400 font-medium first:w-24">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((row) => (
            <tr key={row.date} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="py-2 text-slate-600">{row.date.slice(5)}</td>
              <td className="py-2 text-slate-800">{row.newOrders}</td>
              <td className="py-2 text-slate-800">
                {row.revenue > 0 ? `${row.revenue.toLocaleString()}원` : '0원'}
              </td>
              <td className="py-2 text-slate-800">{row.visitors}</td>
              <td className="py-2 text-slate-800">{row.pageViews}</td>
            </tr>
          ))}
          <tr className="border-t border-slate-200 font-semibold">
            <td className="py-2 text-slate-600">최근 7일</td>
            <td className="py-2 text-slate-800">{totals.newOrders}건</td>
            <td className="py-2 text-slate-800">{totals.revenue.toLocaleString()}원</td>
            <td className="py-2 text-slate-800">{totals.visitors}명</td>
            <td className="py-2 text-slate-800">{totals.pageViews}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
