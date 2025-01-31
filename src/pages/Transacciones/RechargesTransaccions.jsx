import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CheckCircle, Loader2, NotebookText, PlusCircle } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import ModalInstrument from '@/components/globals/modals/ModalInstrument';
import Calcular from '@/components/globals/micro/Calcular';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import Cookies from 'js-cookie'
import CustomSelect3 from '@/components/globals/micro/CustomSelect3';

const RecharguesTransaccions = () => {

  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [walletSelect, setWallet] = useState(null);
  const [countryId, setCountryId] = useState("");
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState("");
  const [instrumens, setInstruments] = useState([]);
  const [instrumen, setInstrument] = useState("");
  const [files, setFiles] = useState([]);
  const [comentario, setComentario] = useState("");
  const [referencia, setReferencia] = useState("");
  const [fechaComprobante, setFechaComprobante] = useState("");
  const [documentClient, setDocumentClient] = useState("")
  const [clientData, setClientData] = useState("")
  const [instrumentsT, setInstrumentsT] = useState([])
  const [instrumentData, setInstrumentData] = useState(null)
  const [originId, setOriginId] = useState(null)
  const [destinationId, setDestinationId] = useState("")
  const [tasaId, setTasaId] = useState(null)
  const [tasaData, setTasaData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState([])

  const [tasaAmount, setTasaAmount] = useState("")
  const [amountSend, setAmountSend] = useState("")
  const [amountReceive, setAmountReceive] = useState("")

  //campos cliente
  const [name, setName] = useState("")
  const [document, setDocument] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
 
  //MODALES
  const [modalClient, setModalClient] = useState(false)
  const [modalInstrument, setModalInstrument] = useState(false)
  const [createInstrument, setCreateInstrument] = useState(false)

  const [walletsT, setWalletsT] = useState([]);
  const [walletId, setWalletId] = useState("");

  const searchClient = () => {
    if (!documentClient) {
      toast.error("Para poder consultar un cliente debes poner su número de documento");
      return;
    }

    instanceWithToken
      .get(`/client/${documentClient}`)
      .then((result) => {
        setClientData(result.data.data);
        setInstrumentsT(result.data.data.instruments);
        console.log(result.data.data.instruments)
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
  const actualizarInstrumento = (instrument) => {
    setInstrumentData(instrument)
    setCreateInstrument(false)
    setModalInstrument(false)
  }


  const getWalletsT = () => {
    instanceWithToken.get('/wallet/for-user?type=RECARGA').then((result) => {
      setWalletsT(result.data.data);
    });
  };

  const setcooc = (id) => {
    setDestinationId(id);
  };

  useEffect(() => {
    getWalletsT()
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


  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1, // Limita la subida a un solo archivo
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const getWallets = () => {
    instanceWithToken.get('/wallet/for-user?type=RECARGA').then((result) => {
      setWallets(result.data.data);
    });
  };

  const getBanks = (countryId) => {
    instanceWithToken.get(`bank?countryId=${countryId}`).then((result) => {
      setBanks(result.data.data);
    });
  };

  const setWalf = (id, contryId) => {
    setWallet(id);
    setCountryId(contryId);
    setOriginId(contryId)
    getBanks(contryId);
  };

  const getAccounts = () => {
    instanceWithToken.get(`instruments-client?bankId=${bank}&useInstruments=PANET`).then((result) => {
      if (!result.data.data) {
        setInstrument([])
      }
      else {
        setInstruments(result.data.data);
      }
    });
  };

  const handleSubmit = () => {
    console.log(walletSelect)
    //TODO: Validar campo por campo
    const validations = [
      { condition: !walletSelect, message: "Estimado Usuario, No ha seleccionado un wallet de origen!" },
      { condition: !destinationId, message: "Estimado Usuario, No ha seleccionado un Wallet Destino!" },
      { condition: !referencia, message: "Estimado Usuario, No ha ingresado una Referencia!" },
      { condition: !fechaComprobante, message: "Estimado Usuario, No ha ingresado una Fecha de Comprobante!" },
      { condition: !bank, message: "Estimado Usuario, No ha seleccionado un Banco!" },
      { condition: !instrumen, message: "Estimado Usuario, No ha seleccionado una Cuenta!" },
      { condition: !files[0], message: "Estimado Usuario, No ha ingresado imagen del Comprobante!" },
      { condition: !amountSend, message: "Estimado Usuario, No ha ingresado el Monto de Envio!" },
      { condition: !clientData, message: "Estimado Usuario, No ha ingresado el Documento del Cliente!" },
      { condition: !instrumentData, message: "Estimado Usuario, No ha ingresado Datos del Instrumento de la Transaccion!" }
    ];
    
    for (const validation of validations) {
      if (validation.condition) {
        alert(validation.message);
        break; // Detiene el bucle al encontrar el primer error
      }
    }
     

    // const id = Cookies.get("userId")
    // console.log({ countryId, bank, fechaComprobante, referencia, instrumen, clientData, instrumentData, id, walletId, tasaId, originId, destinationId, amountSend })

    // if (!countryId || !bank || !fechaComprobante || !referencia || !instrumen || !clientData || !instrumentData || !id || !walletId || !tasaId || !originId || !destinationId || !amountSend) {
    //   alert("Todos los campos, a excepción de la descripción u observación deben ser llenados correctamente!");
    //   return;
    // }
    // setLoading(true)

    // const formData = new FormData();
    // formData.append('walletId', walletSelect);
    // formData.append('instrumentId', instrumen);
    // formData.append('fecha_comprobante', fechaComprobante);
    // formData.append('nro_referencia', referencia);
    // formData.append('comentario', comentario);
    // formData.append('clienteId', clientData?.id)
    // formData.append('instrumentId', instrumentData?.id)
    // formData.append('creadorId', id)
    // formData.append('walletId', walletId)
    // formData.append('rateId', tasaId)
    // formData.append('origenId', originId)
    // formData.append('destinoId', destinationId)
    // formData.append('amount', parseFloat(amountSend))
    // files.forEach(file => {
    //   formData.append('comprobante', file);
    // });

    // instanceWithToken.post('/recharge/transaction/full', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // }).then(response => {
    //   toast.success("Recarga Creada con exito!");
    //   //navigate("/home");
    //   setLoading(false)
    // }).catch(error => {
    //   toast.error("No se ha podido crear la recarga, intente nuevamente!")
    //   setLoading(false)
    // }).finally(() => {
    //   setLoading(false)
    // })
  };

  useEffect(() => {
    getWallets();
  }, []);

  useEffect(() => {
    getAccounts();
  }, [bank]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">
            Transaccion Completa
          </h1>
        </div>
      </div>

      {/* MAIN RECARGA*/}
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
                onSelect={setWalf}
                country={wallet.country.name}
                countryId={wallet.country.id}
                amount={`${wallet.balance} ${wallet.country.currency}`}
                abreviation={wallet.country.abbreviation}
                isActive={walletSelect === wallet.id}
              />
            ))}
          </CardContent>
        </Card>

        {/*DESTINO */}
        <Card>
          <CardHeader>
            <CardTitle>Pais de Destino</CardTitle>
          </CardHeader>

          {!walletSelect ?
            <CardContent>
              Debes Seleccionar un wallet!
            </CardContent> :
            <CardContent>
              <CustomSelect3
                options={countries}
                onSelect={(value) => setDestinationId(value)}
                selectedValue={countries.find((wallet) => wallet.id === destinationId)}
              />
            </CardContent>
          }
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos de la Recarga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='gap-2'>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Comentario" className="mb-1" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Referencia"
                  className="mb-1" />

                <Input
                  value={fechaComprobante}
                  onChange={(e) => setFechaComprobante(e.target.value)}
                  placeholder="Fecha" type="date"
                  className="mb-1" />
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

              <Select onValueChange={(value) => setInstrument(value)}>
                <SelectTrigger className="w-[100%] h-[150]">
                  <SelectValue placeholder="Seleccione Cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {instrumens.map((instrumentt, index) => (
                    <SelectItem value={instrumentt?.id} key={index}>
                      <div className='flex flex-col'>
                        <LabelLateral
                          title={'Tipo de Instrumento'}
                          flexDirection='col'
                          description={instrumentt?.typeInstrument || "No Posee"}
                        />
                        <LabelLateral
                          title={'Titular:'}
                          flexDirection='col'
                          description={instrumentt?.holder || "No Posee"}
                        />
                        <LabelLateral
                          title={'Cuenta:'}
                          flexDirection='col'
                          description={instrumentt?.accountNumber || "No Posee"}
                        />
                        <LabelLateral
                          title={'Tipo de Cuenta:'}
                          flexDirection='col'
                          description={instrumentt?.accountType?.name || "No Posee"}
                        />
                        <LabelLateral
                          title={'Documento:'}
                          flexDirection='col'
                          description={instrumentt?.document || "No Posee"}
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors mt-2 mb-2"
              >
                <input {...getInputProps()} />
                {files.length === 0 ? (
                  <p className="text-gray-500">
                    Arrastra y suelta una imagen aquí, o haz clic para seleccionar una imagen
                  </p>
                ) : (
                  <div className="mt-4">
                    <img
                      src={files[0].preview}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* monto */}
        <Calcular
          modo2={true}
          amountSend={amountSend}
          setAmountSend={setAmountSend}
          amountReceive={amountReceive}
          setAmountReceive={setAmountReceive}
          dataTasa={tasaData}
        />
      </div>

      <div>
        <div >
          {/**MAIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/*CLIENTE*/}
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

            {/*INSTRUMENTO*/}
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


            {/* ENVIAR TRANSACCION */}
            <div className='col-span-2 gap-4'>
              <Button disabled={loading} onClick={handleSubmit} className="w-full">
                {loading && <Loader2 className="animate-spin" />}
                Completar Transaccion</Button>
            </div>
          </div>


          <Dialog open={modalInstrument} onOpenChange={setModalInstrument}>
            <DialogContent className="w-full max-w-[70%] md:max-w-[90%]">
              <DialogHeader>
                <DialogTitle>Seleccione o Cree un Instrumento</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh] w-[100%] rounded-md border p-4">
                <Table>
                  <TableCaption>Si no encuentras el instrumento crea uno nuevo.</TableCaption>
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
                    {instrumentsT.map((instrumentt, index) => (
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
      </div>
    </div>


  );
};

export default RecharguesTransaccions;