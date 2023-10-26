import { ArrowLeft, Trash } from "@phosphor-icons/react";
import './index.css'
import { Link } from "react-router-dom";

interface Props {
  isHome?: boolean;
}
export default function Header({ isHome = true }: Props) {
  return (
    <header id='Header' className="content">
      <div className="logo">
        <Trash size={48}/>
        <h1>Coleta</h1>
      </div>
      { isHome == false && (
        <Link to="/" className="back">
          <ArrowLeft size={28} />
          <strong>Voltar para o início</strong>
        </Link>
      ) }
        
    </header>
  )
}