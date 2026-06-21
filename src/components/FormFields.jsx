import { SKILLS } from '../constants'

export function Field({ label, required, hint, children, full = false }) {
  return (
    <label className={`field ${full ? 'field-full' : ''}`}>
      <span className="field-label">{label}{required && <em>*</em>}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}

export function SkillPicker({ value, onChange, required = false }) {
  const toggle = (skill) => {
    onChange(value.includes(skill) ? value.filter((item) => item !== skill) : [...value, skill])
  }
  return (
    <fieldset className="skill-picker">
      <legend className="field-label">可提供的協助類型{required && <em>*</em>} <small>可複選</small></legend>
      <div className="skill-options">
        {SKILLS.map(({ name, icon }) => (
          <label key={name} className={value.includes(name) ? 'skill-option checked' : 'skill-option'}>
            <input type="checkbox" checked={value.includes(name)} onChange={() => toggle(name)} />
            <span className="skill-icon">{icon}</span>{name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function RadioCards({ name, options, value, onChange }) {
  return (
    <div className="radio-cards">
      {options.map((option) => (
        <label key={option} className={value === option ? 'radio-card checked' : 'radio-card'}>
          <input type="radio" name={name} value={option} checked={value === option} onChange={(event) => onChange(event.target.value)} />
          <span className="radio-dot" />{option}
        </label>
      ))}
    </div>
  )
}

export function SuccessPanel({ title, children, action }) {
  return (
    <section className="success-panel" role="status">
      <div className="success-icon">✓</div>
      <p className="eyebrow">已完成</p>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </section>
  )
}
