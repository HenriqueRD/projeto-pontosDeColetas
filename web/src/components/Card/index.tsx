import './index.css'

interface Props {
  title: string;
  imageUrl: string;
  active?: boolean;
}

export default function Card({ title, imageUrl, active} : Props) {
  return (
    <div id='Card' className={`${active && 'selected'}`}>
      <img src={imageUrl} />
      <span>{title}</span>
    </div>
  )
}