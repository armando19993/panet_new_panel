import React, { useEffect, useState } from 'react'
import { NotebookText } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LabelLateral from '@/components/globals/LabelLateral';
import { instanceWithToken } from '@/utils/instance';
import { CountryDetail } from '@/components/globals/CountryDetail';

const NuevaTransaccion = () => {

  const [wallets, setWallets] = useState([])
  const [walletId, setWalletId] = useState("")
  const [countries, setCountries] = useState([])
  const [destinationId, setDestinationId] = useState("")
  const [originId, setOriginId] = useState("")

  const getWallets = () => {
    instanceWithToken.get('/wallet/for-user?type=RECARGA').then((result) => {
      setWallets(result.data.data);
    });
  };

  const setWall = (id, contryId) => {
    setWalletId(id);
    setOriginId(contryId)
  };

  const setcooc = (id) => {
    setDestinationId(id);
  };


  useEffect(() => {
    getWallets()
  }, [])

  //TODO: Filtrar que se muestren todos los paises menos el seleccionado como origen
  useEffect(() => {
    instanceWithToken.get('/country').then((result) => {
      setCountries(result.data.data);
    });
  }, [walletId])

  //TODO: Asignar el tasaId y valueTasa
  useEffect(() => {
    if (originId && destinationId) {
      instanceWithToken.get(`/rate?originId=${originId}&destinationId=${destinationId}`).then((result) => {
        console.log(result.data.data)
      })
    }
  }, [walletId, destinationId])

  //TODO: Que cuando monto a enviar cambie, se calcule el monto a recibir
  //formula montoEnvio * valueTasa


  //Para la funcion de buscar cliente el endpint a consultar sera /client/{documento escrito en el campo}
  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">
            Nueva Transaccion
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 col-span-2/5 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Pais de Origen</CardTitle>
          </CardHeader>
          <CardContent>
            {wallets.map((wallet, index) => (
              <CountryDetail
                key={index}
                id={wallet.id}
                onSelect={setWall}
                country={wallet.country.name}
                countryId={wallet.country.id}
                amount={`${wallet.balance} ${wallet.country.currency}`}
                abreviation={wallet.country.abbreviation}
                isActive={walletId === wallet.id}
              />
            ))}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Pais de Destino</CardTitle>
          </CardHeader>
          <CardContent>
            {countries.map((country, index) => (
              <CountryDetail
                key={index}
                id={country.id}
                onSelect={setcooc}
                country={country.name}
                countryId={country.id}
                abreviation={country.abbreviation}
                isActive={destinationId === country.id}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaccion</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Documento del Cliente" className="mb-1" />
            <Button className="w-full">Consultar Cliente</Button>

            {/* No se muestra mientras no haya un cliente */}
            <div className='grid grid-cols'>
              <LabelLateral title={"Nombre:"} description={" Armando"} />
              <LabelLateral title={"Telefono:"} description={" 14214"} />
            </div>

            {/* al dar buscar, debe validar que haya datos en el campo, si no lo hay usar toast para decir que debe poner algo, si consigue el cliente entonces muestra los datos si no lo consigue muestra una alerta de que no lo ha conseguido */}
            {/* TODO: Crear la funcion */}
            <Button className='w-full  mt-4'>
              Seleccionar Instrumento
            </Button>
            <Input placeholder="Monto a Enviar" className="mb-1 mt-2" />
            <Input placeholder="Monto a Recibir" className="mb-1 mt-2 mb-4" />
            <LabelLateral title={"Tasa de Calculo:"} description={" 14"} />
          </CardContent>
        </Card>

      </div>

    </div>
  )
}

export default NuevaTransaccion