import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = { eyebrow: string; title: string; body: string }
export default function SimplePage({ eyebrow, title, body }: Props) {
  return <section className="simple-page"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{body}</p><Link className="text-link" to="/"><ArrowLeft size={16}/> Back to home</Link><div className="coming-soon">MORE OF LOURIERPARK, COMING TOGETHER <span>✳</span></div></div></section>
}