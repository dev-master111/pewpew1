import moment from 'moment'
import { useState } from 'react'
import { Icon, Dropdown } from 'semantic-ui-react'

export default function HistoryList({
  onClose,
  onChange,
  value
}) {
  const [hisotry, setHistory] = useState([
    {
      date: '2023/02/21 10:38:00',
      id: Math.round(Math.random() * 1000000)
    },
    {
      date: '2023/02/21 09:38:00',
      id: Math.round(Math.random() * 1000000)
    },
    {
      date: '2023/02/21 07:38:00',
      id: Math.round(Math.random() * 1000000)
    },
    {
      date: '2023/02/20 10:38:00',
      id: Math.round(Math.random() * 1000000)
    },
    {
      date: '2023/02/20 09:38:00',
      id: Math.round(Math.random() * 1000000)
    },
    {
      date: '2023/02/20 07:38:00',
      id: Math.round(Math.random() * 1000000)
    },
  ])

  const groupHistoryByDate = {}
  const daysList = []

  for (let idx=0; idx < 30; idx += 1) {
    const today = moment().subtract(idx, 'day').format('dddd, D MMM YYYY')
    groupHistoryByDate[today] = hisotry.filter(hisData => {
      if (moment(hisData.date).format('YYYY/MM/DD') === moment().subtract(idx, 'day').format('YYYY/MM/DD')) {
        return true
      }

      return false
    })

    if (groupHistoryByDate[today].length > 0) {
      daysList.push(today)
    }
  }

  return (
    <div className="history-list-wrapper">
      <div className="hisotry-header">
        <div className="period">30-day hisotry</div>
        <div className="actions">
          <Dropdown text="" icon="ellipsis horizontal">
            <Dropdown.Menu>
              <Dropdown.Item text='New' />
            </Dropdown.Menu>
          </Dropdown>
          <Icon name="times" onClick={onClose} />
        </div>
      </div>
      <div className="history-list-view">
        {
          daysList.map(day => (
            <div className="history-day" key={day}>
              <div className="day-title">
                {day}
              </div>
              {
                groupHistoryByDate[day].map(data => (
                  <div
                    className={`history-item${data.id === value ? ' selected' : ''}`}
                    key={data.id}
                    onClick={() => onChange(data.id)}
                  >
                    <div>{moment(data.date).format('hh:mm')}</div>
                    <div className="commit-box">
                      <div className="commit-line"></div>
                      <div className="commit-circle" />
                    </div>
                    <div className="commit-id">{data.id}</div>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}
