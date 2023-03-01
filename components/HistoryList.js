import moment from 'moment'
import { useState } from 'react'
import { Icon, Dropdown } from 'semantic-ui-react'

export default function HistoryList({
  onClose,
  onChange,
  value,
  listData
}) {
  const groupHistoryByDate = {}
  const daysList = []

  for (let idx=0; idx < 30; idx += 1) {
    const today = moment().subtract(idx, 'day').format('dddd, D MMM YYYY')
    groupHistoryByDate[today] = listData.filter(hisData => {
      if (moment(hisData.created_at).format('YYYY/MM/DD') === moment().subtract(idx, 'day').format('YYYY/MM/DD')) {
        return true
      }

      return false
    })

    if (groupHistoryByDate[today].length > 0) {
      daysList.push(today)
    }
  }

  const onClickHistory = (data) => {
    if (!value || data._id !== value._id) {
      onChange(data)
    } else {
      onChange(null)
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
                    className={`history-item${value && data._id === value._id ? ' selected' : ''}`}
                    key={data._id}
                    onClick={() => onClickHistory(data)}
                  >
                    <div>{moment(data.created_at).format('hh:mm')}</div>
                    <div className="commit-box">
                      <div className="commit-line"></div>
                      <div className="commit-circle" />
                    </div>
                    <div className="commit-id">{data._id.slice(data._id.length - 6)}</div>
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
