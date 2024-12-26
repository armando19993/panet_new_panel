import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, Globe2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ReactCountryFlag from 'react-country-flag';
import { instanceWithToken } from '@/utils/instance';


const RatesPage = () => {
    const navigate = useNavigate()
    const [countries, setCountries] = useState([]);
    const [tasaMayor, setTasaMayor] = useState(0);
    const [ratesmodal, setRatesmodal] = useState(false);
    const [paisOrigen, setPaisOrigen] = useState('');
    const [rates, setRates] = useState([]);
    const [idOrigen, setIdOrigen] = useState(0);

    useEffect(() => {
        getPaises();
    }, []);

    const getPaises = () => {
        instanceWithToken.get('country').then((result) => {
            toast.success("Listado de Paises obtenidos con exito");
            setCountries(result.data.data);
            setTasaMayor(result.data.data[0].rate_sales);
        });
    };

    const handleFieldChange = (record, index, field, value) => {
        let updatedCountries = [...countries];
        updatedCountries[index] = { ...updatedCountries[index], [field]: value };

        if (record.name === "COLOMBIA") {
            const calculo = updatedCountries[index].rate_purchase / tasaMayor;
            updatedCountries[index].rate_wholesale = calculo.toFixed(3);
        } else if (updatedCountries[index].rate_purchase && updatedCountries[index].rate_sales) {
            const calculo = tasaMayor / updatedCountries[index].rate_purchase;
            updatedCountries[index].rate_wholesale = calculo.toFixed(3);
        }

        setCountries(updatedCountries);
    };

    const reasignarVenta = () => {
        let updatedCountries = [...countries];
        updatedCountries[0].rate_sales = tasaMayor;
        updatedCountries[0].rate_wholesale = tasaMayor;
        setCountries(updatedCountries);
    };

    const update = () => {
        toast.info("Se inicio el proceso de actualizacion de tasas al mayor!");
        countries.forEach((countrie) => {
            const excludedFields = ["createdAt", "updatedAt", "id", "profit", "ven_profit", "especial_profit", "deleteAt"];
            const filteredData = { ...countrie };
            excludedFields.forEach((field) => delete filteredData[field]);
            instanceWithToken.patch('country/' + countrie.id, filteredData).then(() => { });
        });
        toast.success("Se han actualizado las tasas al mayor correctamente");

        toast.info("Se inicio el proceso de actualizacion de tasas al publico!");
        instanceWithToken.patch('rate').then(() => {
            toast.success("Se han actualizado las tasas al publico correctamente");
            getPaises()
        });
    };

    const loadRates = (countrie) => {
        setPaisOrigen(countrie.name);
        setRates([]);
        instanceWithToken.get('rates/origen/' + countrie.id).then((result) => {
            setRates(result.data.data);
        });
    };

    const updateValue = (status, rate) => {
        instanceWithToken.get('rates/update-status/' + status + '/' + rate).then(() => {
            toast.success("Estatus Actualizado con exito");
        });
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="text-xl font-bold text-center md:text-left">
                        Actualización de Montos
                    </div>
                    <div className="w-full md:w-[40%] flex flex-col sm:flex-row gap-2 items-center">
                        <Input
                            value={tasaMayor}
                            onChange={(e) => setTasaMayor(e.target.value)}
                            placeholder="Tasa de Venta Venezuela"
                            className="w-full"
                        />
                        <Button type="primary" block onClick={update} className="w-full sm:w-auto">
                            Actualizar Montos
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {countries.map((countrie, index) => (
                            <div
                                className="flex flex-col p-4 border rounded-lg hover:bg-gray-200"
                                key={index}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Globe2 />
                                    <p className="text-lg font-medium">{countrie.name}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    Tasa de Compra
                                    <Input
                                        value={countrie.rate_purchase}
                                        onChange={(e) =>
                                            handleFieldChange(countrie, index, 'rate_purchase', e.target.value)
                                        }
                                        placeholder="Editar compra"
                                        className="w-full"
                                    />
                                    Tasa de Venta
                                    <Input
                                        value={countrie.rate_sales}
                                        onChange={(e) =>
                                            handleFieldChange(countrie, index, 'rate_sales', e.target.value)
                                        }
                                        placeholder="Editar venta"
                                        className="w-full"
                                    />
                                </div>
                                <div className="text-center font-medium mt-2">

                                    {countrie.rate_wholesale}
                                </div>
                                <div className="mt-4">
                                    <Dialog key={`modal_${countrie.id}`}>
                                        <DialogTrigger onClick={() => loadRates(countrie)} className="w-full flex justify-center">
                                            <Eye />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogDescription className="text-center">
                                                    <span className="text-black font-bold text-4xl">{paisOrigen}</span>
                                                    {rates.map((rate, index) => (
                                                        <div
                                                            className="flex items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg"
                                                            key={index}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <ReactCountryFlag
                                                                    countryCode={rate.destination.abbreviation}
                                                                    className="mr-3"
                                                                />
                                                                <p className="text-sm font-medium">
                                                                    {rate.destination.name}
                                                                </p>
                                                            </div>
                                                            <div className="ml-auto font-medium flex items-center gap-1">
                                                                {rate.rate} {rate.destination.currency}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};

export default RatesPage;
