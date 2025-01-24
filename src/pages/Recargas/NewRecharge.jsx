import React, { useEffect, useState } from 'react';
import { NotebookText } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { instanceWithToken } from '@/utils/instance';
import { CountryDetail } from '@/components/globals/CountryDetail';
import LabelLateral from '@/components/globals/LabelLateral';


const NewRecharge = () => {

  const [wallets, setWallets] = useState([])
  const [walletSelect, setWallet] = useState([])
  const [countryId, setCountryId] = useState("")
  const [banks, setBanks] = useState([])
  const [bank, setBank] = useState("");
  const [instrumens, setInstruments] = useState([])
  const [instrumen, setInstrument] = useState("")
  const [amount, setAmount] = useState("")

  const getWallets = () => {
    instanceWithToken.get('/wallet/for-user?type=RECARGA').then((result) => {
      setWallets(result.data.data)
    })
  }

  const getBanks = (countryId) => {
    instanceWithToken.get(`bank?countryId=${countryId}`).then((result) => {
      setBanks(result.data.data)
    })
  }

  const setWall = (id, contryId) => {
    setWallet(id)
    setCountryId(contryId)
    getBanks(contryId)
  }

  const getAccounts = () => {
    instanceWithToken.get(`instruments-client?bankId=${bank}&useInstruments=PANET`).then((result) => {
      setInstruments(result.data.data)
      console.log(result.data.data[0])
    })
  }

  const handleSubmit = () => {
    if (!amount || !countryId) {
      alert("Todos los campos, a exepcion de la descripcion o observacion deben ser llenados correctamente!")
    }
  }

  useEffect(() => {
    getWallets()
  }, [])

  useEffect(() => {
    getAccounts()
  }, [bank])

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">
            Nueva Recarga
          </h1>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Pais a Recargar</CardTitle>
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
                isActive={walletSelect === wallet.id}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos de la Recarga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='gap-2'>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monto a Recargar"
                className="mb-1"
              />

              <Textarea placeholder="Comentario" className="mb-1" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Referencia" className="mb-1" />
                <Input placeholder="Fecha" type="date" className="mb-1" />
              </div>
              <Select onValueChange={(value) => setBank(value)}>
                <SelectTrigger className="w-[100%] mb-1">
                  <SelectValue placeholder="Selecione Banco" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank, index) => (
                    <SelectItem key={index} value={bank.id}>{bank.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select >
                <SelectTrigger className="w-[100%]">
                  <SelectValue placeholder="Seleccione Cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {instrumens.map((instrumentt, index) => (
                    <SelectItem value={instrumentt.id} key={index}>
                      <div className='flex flex-col'>
                        <LabelLateral title={'Tipo de Instrumento'} flexDirection='col' description={instrumentt.typeInstrument} />
                        <LabelLateral title={'Tipo de Instrumento'} flexDirection='col' description={instrumentt.typeInstrument} />
                        <LabelLateral title={'Tipo de Instrumento'} flexDirection='col' description={instrumentt.typeInstrument} />
                        <LabelLateral title={'Tipo de Instrumento'} flexDirection='col' description={instrumentt.typeInstrument} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => handleSubmit()} className='w-full  mt-2'>
                Recargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div >

    </div>


  )
}

export default NewRecharge