import { instanceWithToken } from '@/utils/instance'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import Select from 'react-select'
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const ModalInstrument = ({ isOpen, setIsOpen, clientId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [accountTypes, setAccountTypes] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);
    const [formData, setFormData] = useState({
        holder: "",
        accountNumber: "",
        accountTypeId: "",
        countryId: "",
        bankId: "",
        typeInstrument: "PAGO_MOVIL",
        profit: ""
    });

    useEffect(() => {
        resetForm()
    }, [isOpen])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === 'countryId') {
                return {
                    ...prev,
                    [name]: value,
                    accountTypeId: "",
                    bankId: "",
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const resetForm = () => {
        setIsLoading(false)
        setFormData({
            holder: "",
            accountNumber: "",
            accountTypeId: "",
            countryId: "",
            bankId: "",
            typeInstrument: "PAGO_MOVIL",
            profit: ""
        });
    };

    useEffect(() => {
        if (formData.countryId) {
            fetchDependentData(formData.countryId);
        } else {
            setAccountTypes([]);
            setBanks([]);
        }
    }, [formData.countryId]);

    const getCountries = async () => {
        try {
            const result = await instanceWithToken.get("country");
            setCountries(result.data.data);
        } catch (error) {
            toast.error("Error al cargar los países");
        }
    };

    const fetchDependentData = async (countryId) => {
        setIsLoadingDependencies(true);
        try {
            const [accountTypesResponse, banksResponse] = await Promise.all([
                instanceWithToken.get(`account-type?countryId=${countryId}`),
                instanceWithToken.get(`bank?countryId=${countryId}`)
            ]);

            setAccountTypes(accountTypesResponse.data.data);
            setBanks(banksResponse.data.data);
        } catch (error) {
            toast.error("Error al cargar los datos dependientes");
        } finally {
            setIsLoadingDependencies(false);
        }
    };

    const INSTRUMENT_TYPES = {
        PAGO_MOVIL: "Pago Móvil",
        CUENTA_BANCARIA: "Cuenta Bancaria",
        CUENTA_DIGITAL: "Cuenta Digital",
        BILLETERA_MOVIL: "Billetera Móvil",
    };


    const handleSave = async () => {
        setIsLoading(true);

        formData.useInstruments = "PANET";
        if (!formData.accountTypeId) {
            delete formData.accountTypeId;
        }

        // Convertir profit a número decimal
        if (formData.profit) {
            formData.profit = parseFloat(formData.profit);
        }

        formData.clientId = clientId;

        instanceWithToken.post("instruments-client", formData).then((result) => {
            console.log(result.data.data)
            setIsOpen(result.data.data)
            toast.success("Instrumento creado correctamente");
        })
    }

    useEffect(() => {
        getCountries()
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95vw] max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{"Agregar Instrumento"}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4">
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
                            {/* Mostrar Tipo de Cuenta solo si no es PAGO_MOVIL */}
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

                            {/* Mostrar Banco solo si es Cuenta Bancaria */}
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

                            {/* Mostrar Documento, Cuenta y Titular solo si el tipo de instrumento es PAGO_MOVIL o BILLETERA_MOVIL */}
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


                            {/* Mostrar Titular y Cuenta si es Cuenta Digital */}
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
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModalInstrument