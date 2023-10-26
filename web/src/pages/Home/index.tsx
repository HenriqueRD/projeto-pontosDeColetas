import Header from "../../components/Header"
import { ArrowRight, SignIn } from "@phosphor-icons/react";
import banner from "../../assets/home-background.svg"
import './index.css'
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import api from "../../api/api";

interface Uf {
  sigla: string,
  nome: string,
}
interface City {
  nome: string,
}

export default function Home() {
  
  const [ ufs, setUfs ] = useState<Uf[]>([])
  const [ citys, setCitys ] = useState<City[]>([])

  const [ uf, setUf ] = useState('0')
  const [ city, setCity ] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    api.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(x => setUfs(x.data))
  }, [])

  useEffect(() => {
    if(uf == '0') { return }
    api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(x => setCitys(x.data))
  }, [uf])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    navigate('/points', { state: {
      uf: "RS",
      city: "Cruzeiro do Sul"
    } })
  }

  return (
    <>
      <Header />
      <main id="Home" className="content">
        <div>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          <Link to="/createPoint">
            <span>
              <SignIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="input w40">
              <select name="uf" id="uf" value={uf} onChange={x => setUf(x.target.value)}>
                <option value="0">Selecione uma UF</option>
                {
                  ufs.map(x => { return (
                    <option key={x.sigla} value={x.sigla}>{x.nome}</option>
                  ) }
                )}
              </select>
            </div>
            <div className="input">
              <select name="city" id="city" value={city} onChange={x => setCity(x.target.value)}>
                <option value="0">Selecione uma cidade</option>
                {
                  citys.map(x => { return (
                    <option key={x.nome} value={x.nome}>{x.nome}</option>
                  ) }
                )}
              </select>
            </div>
            <button>
              <span>
                <ArrowRight />
              </span>
              <strong>Entrar</strong>
            </button>
          </form>
        </div>
        <img src={banner} alt="Banner" />
      </main>
    </>
  )
}