import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
  const [wallets, setWallets] = useState([]);
  const [walletSelect, setWallet] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState("");
  const [instrumens, setInstruments] = useState([]);
  const [instrumen, setInstrument] = useState("");
  const [amount, setAmount] = useState("");
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
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

  const setWall = (id, contryId) => {
    setWallet(id);
    setCountryId(contryId);
    getBanks(contryId);
  };

  const getAccounts = () => {
    instanceWithToken.get(`instruments-client?bankId=${bank}&useInstruments=PANET`).then((result) => {
      setInstruments(result.data.data);
    });
  };

  const handleSubmit = () => {

    //aqui debes validar todos los campos
    if (!amount || !countryId || !bank) {
      alert("Todos los campos, a excepción de la descripción u observación deben ser llenados correctamente!");
      return;
    }
    //aqui agregas los otros valores
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('countryId', countryId);
    formData.append('bank', bank);
    formData.append('instrument', instrumen);
    formData.append('fechaComprobante', instrumen);
    formData.append('referecia', instrumen);
    formData.append('comentario', instrumen);
    files.forEach(file => {
      formData.append('files', file);
    });

    instanceWithToken.post('/recharge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      alert('Recarga realizada con éxito!');
      // Aquí puedes agregar cualquier lógica adicional después de una recarga exitosa
    }).catch(error => {
      console.error('Error al realizar la recarga:', error);
    });
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
              <Select onValueChange={(value) => setInstrument(value)}>
                <SelectTrigger className="w-[100%] h-[150]">
                  <SelectValue placeholder="Seleccione Cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {instrumens.map((instrumentt, index) => (
                    <SelectItem value={instrumentt.id} key={index}>
                      <div className='flex flex-col'>
                        <LabelLateral title={'Tipo de Instrumento'} flexDirection='col' description={instrumentt.typeInstrument} />
                        {/*    <LabelLateral title={'Nro de Cuenta'} flexDirection='col' description={instrumentt.accountNumber} />
                        <LabelLateral title={'Id Instrumento'} flexDirection='col' description={instrumentt.instrument.bank.name} />*/}
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
                <p className="text-gray-500">
                  Arrastra y suelta una imagen aquí, o haz clic para seleccionar una imagen
                </p>
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Archivo seleccionado:</p>
                    <ul>
                      {files.map((file, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button onClick={handleSubmit} className='w-full mt-2'>
                Recargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewRecharge;