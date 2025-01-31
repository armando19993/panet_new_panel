import React, { useEffect, useState } from 'react'
import { CheckCircle, Loader2, NotebookText, PlusCircle } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LabelLateral from '@/components/globals/LabelLateral';
import { instanceWithToken } from '@/utils/instance';
import { CountryDetail } from '@/components/globals/CountryDetail';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomSelect from '@/components/globals/micro/CustomSelect';
import CustomSelect2 from '@/components/globals/micro/CustomSelect2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import ModalInstrument from '@/components/globals/modals/ModalInstrument';
import Calcular from '@/components/globals/micro/Calcular';

const NuevaTransaccion = () => {
  const navigation = useNavigate()
  const [wallets, setWallets] = useState([])
  const [walletId, setWalletId] = useState("")
  const [countries, setCountries] = useState([])
  const [destinationId, setDestinationId] = useState("")
  const [originId, setOriginId] = useState(null)
  const [tasaAmount, setTasaAmount] = useState("")
  const [amountSend, setAmountSend] = useState("")
  const [amountReceive, setAmountReceive] = useState("")
  const [documentClient, setDocumentClient] = useState("")
  const [tasaId, setTasaId] = useState(null)
  const [tasaData, setTasaData] = useState(null)
  const [clientData, setClientData] = useState("")
  const [instruments, setInstruments] = useState([])
  const [instrumentData, setInstrumentData] = useState(null)
  const [loading, setLoading] = useState(false)
  //modales
  const [modalInstrument, setModalInstrument] = useState(false)
  const [modalClient, setModalClient] = useState(false)
  const [createInstrument, setCreateInstrument] = useState(false)

  //campos cliente
  const [name, setName] = useState("")
  const [document, setDocument] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const getWallets = () => {
    instanceWithToken.get('/wallet/for-user?type=RECARGA').then((result) => {
      setWallets(result.data.data);
    });
  };

  const setWall = (wallet) => {
    setWalletId(wallet.id);
    setOriginId(wallet.country.id)
  };

  const setcooc = (id) => {
    setDestinationId(id);
  };


  useEffect(() => {
    getWallets()
  }, [])

  useEffect(() => {
    instanceWithToken.get('/country').then((result) => {
      const filteredCountries = result.data.data.filter(country => country.id !== originId);

      setCountries(filteredCountries);
    });
  }, [walletId, originId]);

  useEffect(() => {
    if (originId && destinationId) {
      instanceWithToken.get(`/rate?originId=${originId}&destinationId=${destinationId}`).then((result) => {
        setTasaId(result.data.data.id)
        setTasaData(result.data.data)
        console.log(result.data.data)
        setTasaAmount(result.data.data.amount)
      })
    }
  }, [walletId, destinationId])

  useEffect(() => {
    if (tasaAmount) {
      setAmountReceive(tasaAmount * amountSend)
      console.log("se esta calculadno")
    }
  }, [amountSend])

  const searchClient = () => {
    if (!documentClient) {
      toast.error("Para poder consultar un cliente debes poner su número de documento");
      return;
    }

    instanceWithToken
      .get(`/client/${documentClient}`)
      .then((result) => {
        setClientData(result.data.data);
        setInstruments(result.data.data.instruments);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          if (error.response.data.message === "Cliente no existe") {
            setDocument(documentClient)
            setModalClient(true);
            toast.error("Cliente no existe, procede a crearlo");
          } else {
            toast.error(error.response.data.message || "Error al buscar el cliente");
          }
        } else {
          toast.error("Error al buscar el cliente");
        }
      });
  };

  const addInstrument = () => {
    setCreateInstrument(true)
  }

  const selectInstrument = (instrument) => {
    setInstrumentData(instrument)
    setModalInstrument(false)
    toast.success("Instrumento Seleccionado Correctamente")
  }

  const save = () => {
    //TODO: Validacion campo por campo
    const id = Cookies.get("userId")
    if (!clientData || !instrumentData || !id || !walletId || !tasaId || !originId || !destinationId || !amountSend) {
      toast.error("Debes completar todos los campos para poder realizar la transaccion")
      return
    }
    setLoading(true)
    const payload = {
      clienteId: clientData?.id,
      instrumentId: instrumentData?.id,
      creadorId: id,
      walletId: walletId,
      rateId: tasaId,
      origenId: originId,
      destinoId: destinationId,
      amount: parseFloat(amountSend),
    };

    instanceWithToken.post('transaction', payload).then((result) => {
      toast.success("Transaccion Realizada Correctamente")
      navigation("/transactions")
    }).catch((e) => {
      console.log(e)
    }).finally(() => {
      setLoading(false)
    })

  }

  const storeClient = () => {
    const payload = { name, document, phone, email }
    if (!name || !document || !phone) {
      toast.error("Debes completar todos los campos")
      return
    }
    setLoading(true)
    instanceWithToken.post('client', payload).then((result) => {
      setClientData(result.data.data)
      setModalClient(false)
      toast.success("Cliente Creado Correctamente")
    }).catch(() => {
      toast.error("Error al crear al cliente")
    }).finally(() => {
      setLoading(false)
    })
  }

  const actualizarInstrumento = (instrument) => {
    setInstrumentData(instrument)
    setCreateInstrument(false)
    setModalInstrument(false)
  }
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

      <div className="grid grid-cols-1 md:grid-cols-2 col-span-2/5 gap-4 mt-8">
        {/* origen */}
        <Card>
          <CardHeader>
            <CardTitle>Pais de Origen</CardTitle>
          </CardHeader>

          <CardContent>

            <CustomSelect
              options={wallets}
              onSelect={(value) => setWall(value)}
              selectedValue={wallets.find((wallet) => wallet.id === walletId)}
            />
          </CardContent>
        </Card>

        {/* destino */}
        <Card>
          <CardHeader>
            <CardTitle>Pais de Destino</CardTitle>
          </CardHeader>
          {!originId ?
            <CardContent>
              Debes Seleccionar un wallet!
            </CardContent> :
            <CardContent>

              <CustomSelect2
                options={countries}
                onSelect={(value) => setcooc(value.id)}
                selectedValue={countries.find((wallet) => wallet.id === destinationId)}
              />
            </CardContent>
          }
        </Card>

        {/* cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
            <CardContent>
              <Input
                value={documentClient}
                onChange={(e) => setDocumentClient(e.target.value)}
                placeholder="Documento del Cliente"
                className="mb-1"
              />
              <Button className="w-full mt-2" onClick={searchClient}>Consultar Cliente</Button>

              {/* No se muestra mientras no haya un cliente */}
              {clientData &&
                <>
                  <div className='grid grid-cols bg-gray-100 mt-2 mb-2 rounded-lg p-2'>
                    <LabelLateral title={"Cliente Seleccionado"} />
                    <LabelLateral title={"Nombre:"} description={clientData?.name} />
                    <LabelLateral title={"Telefono:"} description={clientData?.phone} />
                  </div>

                </>
              }
            </CardContent>
          </CardHeader>
        </Card>

        {/* instrumento */}
        <Card>
          <CardHeader>
            <CardTitle>Instrumento</CardTitle>
          </CardHeader>

          <CardContent>
            <Button onClick={() => setModalInstrument(true)} className='w-full  '>
              Seleccionar Instrumento
            </Button>
            {instrumentData &&
              <>
                <div className='grid grid-cols bg-gray-100 mt-2 mb-2 rounded-lg p-2'>
                  <LabelLateral title={"Instrumento Seleccionado"} />
                  <LabelLateral title={"Tipo:"} description={instrumentData?.typeInstrument} />
                  <LabelLateral title={"Nombre:"} description={instrumentData?.holder} />
                  <LabelLateral title={"Banco:"} description={instrumentData?.bank.name} />
                  <LabelLateral title={"Identificador:"} description={instrumentData?.accountNumber} />
                </div>

              </>
            }
          </CardContent>
        </Card>

        {/* monto */}
        <Calcular
          amountSend={amountSend}
          setAmountSend={setAmountSend}
          amountReceive={amountReceive}
          setAmountReceive={setAmountReceive}
          dataTasa={tasaData}
        />

        <Card>
          <CardHeader>
            <CardTitle>Completar Transaccion</CardTitle>
          </CardHeader>

          <CardContent>
            <Button disabled={loading} onClick={save} className="w-full">
              {loading && <Loader2 className="animate-spin" />}
              Completar Transaccion</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalInstrument} onOpenChange={setModalInstrument}>
        <DialogContent className="w-full max-w-[70%] md:max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Seleccione o Cree un Instrumento</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] w-[100%] rounded-md border p-4">
            <Table>
              <TableCaption>Si no encunetras el instrumento crea uno nuevo.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Identificador</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {instruments.map((instrumentt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{instrumentt.typeInstrument}</TableCell>
                    <TableCell>{instrumentt.holder}</TableCell>
                    <TableCell>{instrumentt.bank ? instrumentt.bank.name : null}</TableCell>
                    <TableCell>{instrumentt.accountNumber}</TableCell>
                    <TableCell className="text-right">
                      <CheckCircle onClick={() => selectInstrument(instrumentt)} className="hover:text-green-500" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={addInstrument}><PlusCircle /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalClient} onOpenChange={setModalClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cree un Cliente</DialogTitle>
          </DialogHeader>
          <Label>Nombre del Cliente</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <Label>Documento del Cliente</Label>
          <Input value={document} onChange={(e) => setDocument(e.target.value)} />

          <Label>Telefono del Cliente</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

          <Label>Correo del Cliente</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />

          <Button disabled={loading} onClick={storeClient} className="full">
            {loading && <Loader2 className="animate-spin" />}
            Crear Cliente
          </Button>
        </DialogContent>
      </Dialog>

      <ModalInstrument clientId={clientData.id} isOpen={createInstrument} setIsOpen={actualizarInstrumento} />
    </div>
  )
}

export default NuevaTransaccion