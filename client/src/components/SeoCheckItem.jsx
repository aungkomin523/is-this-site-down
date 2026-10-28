import { BsExclamationTriangleFill, BsXCircleFill } from 'react-icons/bs'

const ICONS = { warn: BsExclamationTriangleFill, fail: BsXCircleFill }
const LABELS = { warn: 'Warning', fail: 'Failed' }

// One problem in the "Needs attention" list
function SeoCheckItem({ check }) {
  const Icon = ICONS[check.status] || BsExclamationTriangleFill

  return (
    <li className={`seo-issue seo-issue--${check.status}`}>
      <div className="seo-issue__top">
        <Icon className="seo-issue__icon" size={16} aria-hidden="true" />
        <span className="seo-issue__name">{check.name}</span>
        <span className={`seo-tag seo-tag--${check.status}`}>{LABELS[check.status]}</span>
      </div>
      <p className="seo-issue__detail">Found: {check.detail}</p>
      {check.fix && (
        <p className="seo-issue__fix">
          <strong>How to fix:</strong> {check.fix}
        </p>
      )}
    </li>
  )
}

export default SeoCheckItem
