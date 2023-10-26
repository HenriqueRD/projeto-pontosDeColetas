import Header from "../../components/Header"
import { useEffect, useState } from "react"
import api from "../../api/api";
import './index.css'
import { useParams } from "react-router-dom";
import { EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";

interface Point { 
    id: string,
    name: string,
    image: string,
    uf: string,
    city: string,
    latitude: number,
    longitude: number
    itens: [
      {
        title: string
      }
    ]
}

export default function Point() {
  const { id } = useParams()
  const [ point, setPoint ] = useState<Point>()  

  useEffect(() => {
    async function get() {
      await api.get('/points/' + id).then(x => setPoint(x.data)).catch(err => console.log(err));
    }
    get()

  }, [])
  return (
    <>
      <Header isHome={false} />
      <main id="Point">
        <img src={point?.image} alt="" />
        <h1>{point?.name}</h1>
        <div className="itens">
          <h2>Coletas</h2>
          <div>
            {
              point?.itens.map(x => {
                return (
                  <span>{x.title}</span>
                )
              })
            }
          </div>
        </div>
        <div className="address">
          <h2>Endereço</h2>
          <div>
            <p>{point?.city} - {point?.uf}</p>
            <p>N* 075</p>
          </div>
        </div>
        <div className="contact">
          <div>
            <a href="#"><WhatsappLogo size={28} /> Whatsapp</a>
            <a href="#"><EnvelopeSimple size={28} /> Email</a>
          </div>
        </div>
      </main>
    </>
  )
}