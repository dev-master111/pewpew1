import { Form } from 'semantic-ui-react'

export default function RangeItem({
  label,
  value,
  min,
  max,
  name,
  onChange,
  step
}) {
  return (
    <div className="range-item-container">
      <div className="item-label">
        <div>{label}</div>
        <div>{value}</div>
      </div>
      <div>
        <Form.Input
          label=""
          min={min}
          max={max}
          name={name}
          onChange={onChange}
          step={step}
          type="range"
          value={value}
        />
      </div>
    </div>
  )
}
