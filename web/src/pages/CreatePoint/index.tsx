import Card from "../../components/Card"
import Header from "../../components/Header"
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

import './index.css'
import { useState, useEffect, FormEvent } from "react"
import api from "../../api/api"
import { useNavigate } from "react-router-dom"
import Dropzone from "../../components/Dropzone"

interface Item{
  id: number,
  title: string,
  imageUrl: string,
}
interface Uf {
  sigla: string,
  nome: string,
}
interface City {
  nome: string,
}

export default function CreatePoint() {

  const [ items, setItems ] = useState<Item[]>([])
  const [ ufs, setUfs ] = useState<Uf[]>([])
  const [ citys, setCitys ] = useState<City[]>([])

  const [ position, setPosition ] = useState<[number, number]>([0, 0])
  const [ uf, setUf ] = useState('0')
  const [ city, setCity ] = useState('')
  const [ image, setImage ] = useState<File>()
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ phone, setPhone ] = useState(0)
  const [ itemList, setItemList ] = useState<number[]>([])

  const navigate = useNavigate();

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('/itens/').then(x => setItems(x.data))
  }, [])
  
  useEffect(() => {
    api.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(x => setUfs(x.data))
  }, [])

  useEffect(() => {
    if(uf == '0') { return }
    api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(x => setCitys(x.data))
  }, [uf])

  function LocationMarker() {
    useMapEvents({
      click(x) {
        setPosition([x.latlng.lat, x.latlng.lng])
      },
    })
    return position === null ? null : (
      <Marker position={position} />
    )
  }

  function handleAddItems(id: number) {
    const itemSelected = itemList.findIndex(item => item === id)
    if(itemSelected >= 0) {
      const newList = itemList.filter(item => item !== id)
      setItemList(newList as [])
    }
    else {
      setItemList([ ...itemList, id ] )
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const data = new FormData() 
    data.append('name', name)
    data.append('email', email)
    data.append('phone', String(phone))
    data.append('city', city)
    data.append('uf', uf)
    data.append('latitude', String(position[0]))
    data.append('longitude', String(position[1]))
    data.append('itens', itemList.join(','))
    if(image !== undefined) {
      data.append('image', image)
    }
  
    await api.post('/points/', data)

    navigate('/')
  }
  
  return (
    <>
      <Header isHome={false} />
      <main id="CreatePoint" className="content">
        <form onSubmit={handleSubmit}>
          <h1>Cadastro do ponto de coleta</h1>

          <Dropzone onFileUploaded={setImage} />

          <div className="field">
            <div className="header">
              <h2>Dados</h2>
            </div>
            <div className="input">
              <label htmlFor="name">Nome da entidade</label>
              <input id="name" type="text" value={name} onChange={x => {setName(x.target.value)}} />
            </div>
            <div className="input">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={x => {setEmail(x.target.value)}} />
            </div>
            <div className="input w40">
              <label htmlFor="phone">Telefone</label>
              <input id="phone" type="number" value={phone} onChange={x => {setPhone(parseInt(x.target.value))}} />
            </div>
          </div>

          <div className="field">
            <div className="header">
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </div>
            {
              initialPosition[0] !== 0 && (
                <MapContainer center={initialPosition} zoom={12} >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                </MapContainer>
              )
            }
            <div className="inputGroup">
              <div className="input w40">
                <label htmlFor="uf">Estado</label>
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
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" value={city} onChange={x => setCity(x.target.value)}>
                  <option value="0">Selecione uma cidade</option>
                  {
                    citys.map(x => { return (
                      <option key={x.nome} value={x.nome}>{x.nome}</option>
                    ) }
                  )}
                </select>
              </div>
            </div>
            <div className="input w40">
                <label htmlFor="number">Número</label>
                <input id="number" type="number" />
              </div>
          </div>

          <div className="field">
            <div className="header">
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </div>
            <div className="cards">
              {
                items.map((x) => {
                  return (
                    <div key={x.id} onClick={() => handleAddItems(x.id)}>
                      <Card title={x.title} imageUrl={x.imageUrl} active={itemList.includes(x.id)} />
                    </div>
                  )
                })
              }
            </div>
          </div>
          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </main>
    </>
  )
}