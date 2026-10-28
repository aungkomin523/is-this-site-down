import { HTTP_CODES, WHO_LABELS } from '../content/faq'

const codeClass = (code) => `http-code__num--${code.charAt(0)}xx`

function HttpCodeGuide() {
  return (
    <ul className="http-codes">
      {HTTP_CODES.map((item) => (
        <li key={item.code} className="http-code">
          <span className={`http-code__num ${codeClass(item.code)}`}>{item.code}</span>
          <span className="http-code__name">{item.name}</span>
          <span className={`http-code__who http-code__who--${item.who}`}>
            <span className="visually-hidden">Whose problem: </span>
            {WHO_LABELS[item.who]}
          </span>
          <p className="http-code__desc">{item.desc}</p>
        </li>
      ))}
    </ul>
  )
}

export default HttpCodeGuide
