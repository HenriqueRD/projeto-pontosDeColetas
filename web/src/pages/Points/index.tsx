import { useLocation } from "react-router-dom"
import Header from "../../components/Header"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useState, useEffect } from "react"
import api from "../../api/api";
import './index.css'
import Card from "../../components/Card";
import { Link } from "react-router-dom";

interface Item {
  id: number,
  title: string,
  imageUrl: string,
}

interface Point { 
    id: string,
    title: string,
    image: string,
    latitude: number,
    longitude: number
}

export default function Points() {
  
  const [ items, setItems ] = useState<Item[]>([])
  const [ pointsMap, setPointsMap ] = useState<Point[]>([]);

  const { state } = useLocation();
  const [ itemList, setItemList ] = useState<number[]>([])
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

    if(itemList.length == 0) {
      return
    }

    async function get() {
      api.get('/points/', {
        params: {
          city: state.city,
          uf: state.uf,
          itens: itemList
        }
      }).then(response => {
        setPointsMap(response.data);
      }).catch(err => console.log(err));
    }

    get()

  }, [itemList])

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

  return (
    <>
      <Header isHome={false} />
      <main id="Points">
        <div>
          <div>
            <h2>Encontre no mapa um ponto de coleta</h2>
            <span>Escolha abaixo os itens para visualizar pontos no mapa</span>
          </div>
          <span>{state.city} - {state.uf}</span>
        </div>
          {
            initialPosition[0] !== 0 && (
              <MapContainer center={initialPosition} zoom={12} >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                  pointsMap.map(x => {
                    return (
                      <Marker key={x.id} position={[x.latitude, x.longitude]}>
                        <Popup>
                          <Link to={`/point/${x.id}`}>Conhecer</Link>
                        </Popup>
                      </Marker>
                    )
                  })
                }
              </MapContainer>
            )
          }
        <div className="cardsContainer">
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
      </main>
    </>
  )
}