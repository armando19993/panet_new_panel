import React, { useEffect, useState } from 'react'
import { CheckCircle, NotebookText, PlusCircle } from "lucide-react";
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

const NuevaTransaccion = () => {

  const [wallets, setWallets] = useState([])
  const [walletId, setWalletId] = useState("")
  const [countries, setCountries] = useState([])
  const [destinationId, setDestinationId] = useState("")
  const [originId, setOriginId] = useState(null)
  const [montoEnviar, setmontoEnviar] = useState("")
  const [tasaId, setTasaId] = useState("")
  const [tasaAmount, setTasaAmount] = useState("")
  const [amountSend, setAmountSend] = useState("")
  const [amountReceive, setAmountReceive] = useState("")
  const [documentClient, setDocumentClient] = useState("")
  const [clientData, setClientData] = useState("")
  const [instruments, setInstruments] = useState([])
  const [instrumentData, setInstrumentData] = useState(null)
  //modales
  const [modalInstrument, setModalInstrument] = useState(false)
  const [createInstrument, setCreateInstrument] = useState(false)

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
        setTasaAmount(result.data.data.amount)
      })
    }
  }, [walletId, destinationId])

  useEffect(() => {
    if (tasaAmount) {
      setAmountReceive(tasaAmount * amountSend)
    }
  }, [amountSend])

  const searchClient = () => {
    if (!documentClient) {
      toast.error("Para poder consultar un cliente debes poner su numero de documento")
      return
    }

    instanceWithToken.get(`/client/${documentClient}`).then((result) => {
      setClientData(result.data.data)
      setInstruments(result.data.data.instruments)
    })
  }

  const addInstrument = () => {

  }

  const selectInstrument = (instrument) => {
    setInstrumentData(instrument)
    setModalInstrument(false)
    toast.success("Instrumento Seleccionado Correctamente")
  }

  //originId, destinationId, amountSend, amountReceive, tasaId, instrumentId, clientId


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
          {!originId ?
            <CardContent>
              Debes Seleccionar un wallet!
            </CardContent> :
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
          }
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaccion</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={documentClient}
              onChange={(e) => setDocumentClient(e.target.value)}
              placeholder="Documento del Cliente"
              className="mb-1"
            />
            <Button className="w-full" onClick={searchClient}>Consultar Cliente</Button>

            {/* No se muestra mientras no haya un cliente */}
            {clientData &&
              <>
                <div className='grid grid-cols bg-gray-100 mt-2 mb-2 rounded-lg p-2'>
                  <LabelLateral title={"Cliente Seleccionado"} />
                  <LabelLateral title={"Nombre:"} description={clientData?.name} />
                  <LabelLateral title={"Telefono:"} description={clientData?.phone} />
                </div>
                <Button onClick={() => setModalInstrument(true)} className='w-full  mt-4'>
                  Seleccionar Instrumento
                </Button>
              </>
            }
            <Input
              value={amountSend}
              onChange={(e) => {
                setAmountSend(e.target.value)
              }}
              placeholder="Monto a Enviar"
              className="mb-1 mt-2"

            />
            <Input placeholder="Monto a Recibir" value={amountReceive} dissabled className="mb-1 mt-2 " />
            <LabelLateral title={"Tasa de Calculo:"} description={tasaAmount} />
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

      {/* <Dialog open={createClient} onOpenChange={setCreateClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Cliente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tipo de Documento
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione Tipo de Documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos de Documento</SelectLabel>
                    {typesDocuments.map((document, index) => (
                      <SelectItem key={index} value={document.code}>{document.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Numero de Documento
            </Label>
            <Input id="name" value={document} onChange={(event) => setdocument(event.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Telefono
            </Label>
            <Input id="name" value={phone} onChange={(event) => setPhone(event.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Correo
            </Label>
            <Input id="name" value={email} onChange={(event) => setEmail(event.target.value)} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button onClick={store}><SaveIcon /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={createInstrument} onOpenChange={setCreateInstrument}>
        <DialogContent className="w-[95vw] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Editar Instrumento" : "Agregar Instrumento"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">

            <Label>
              Dueño de cuenta:
              <Select
                onChange={handleChange}
                options={users}
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                placeholder="Selecciona un usuario..."
              />
            </Label>
            <Label>
              País
              <select
                name="countryId"
                value={formData.countryId}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring"
              >
                <option value="">Seleccionar país</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </Label>

            <Label>
              Tipo de Instrumento
              <select
                name="typeInstrument"
                value={formData.typeInstrument}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring"
              >
                {Object.entries(INSTRUMENT_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Label>

            {isLoadingDependencies && formData.countryId && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Cargando datos...</span>
              </div>
            )}

            {formData.countryId && !isLoadingDependencies && (
              <>
                {formData.typeInstrument !== 'PAGO_MOVIL' && (
                  <Label>
                    Tipo de Cuenta
                    <select
                      name="accountTypeId"
                      value={formData.accountTypeId}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring"
                    >
                      <option value="">Seleccionar tipo de cuenta</option>
                      {accountTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </Label>
                )}

        
                <Label>
                  Banco
                  <select
                    name="bankId"
                    value={formData.bankId}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                  >
                    <option value="">Seleccionar banco</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </Label>

                {['PAGO_MOVIL', 'BILLETERA_MOVIL', 'CUENTA_BANCARIA'].includes(formData.typeInstrument) && (
                  <>
                    <Label>
                      Documento
                      <Input
                        name="document"
                        value={formData.document}
                        onChange={handleInputChange}
                        placeholder="Número de documento"
                      />
                    </Label>

                    <Label>
                      Nombre del Titular
                      <Input
                        name="holder"
                        value={formData.holder}
                        onChange={handleInputChange}
                        placeholder="Nombre del titular"
                      />
                    </Label>
                  </>
                )}


                {formData.typeInstrument === 'CUENTA_DIGITAL' && (
                  <>
                    <Label>
                      Nombre del Titular
                      <Input
                        name="holder"
                        value={formData.holder}
                        onChange={handleInputChange}
                        placeholder="Nombre del titular"
                      />
                    </Label>


                  </>
                )}

                <Label>
                  {formData.typeInstrument === 'PAGO_MOVIL' ? 'Número de Teléfono' :
                    formData.typeInstrument === 'BILLETERA_MOVIL' ? 'Número Billetera' :
                      formData.typeInstrument === 'CUENTA_DIGITAL' ? 'Id de Billetera' :
                        'Número de Cuenta'}
                  <Input
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder={formData.typeInstrument === 'PAGO_MOVIL' ? 'Número de teléfono' :
                      formData.typeInstrument === 'BILLETERA_MOVIL' ? 'Número billetera' :
                        formData.typeInstrument === 'CUENTA_DIGITAL' ? 'Id de billetera' : 'Número de cuenta'}
                  />
                </Label>

                <Label>
                  Ganancia %
                  <Input
                    name="profit"
                    value={formData.profit}
                    onChange={handleInputChange}
                    placeholder={'Ganancia %'}
                  />
                </Label>

              </>
            )}
          </div>
          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || isLoadingDependencies || !formData.countryId}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Guardando..." : editIndex !== null ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

    </div>
  )
}

export default NuevaTransaccion