import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Pencil, Trash2, Plus, CreditCard, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Select from 'react-select'

export const InstrumentsPage = () => {
    const [instruments, setInstruments] = useState([]);
    const [countries, setCountries] = useState([]);
    const [accountTypes, setAccountTypes] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);
    const [searchTerm, setSearchTerm] = useState({ holder: "", country: "", accountType: "" });
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
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
        getUsers()
        getInstruments();
        getCountries();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            formData.useInstruments = "PANET";

            // Verificar y eliminar accountTypeId si está vacío o no tiene un valor
            if (!formData.accountTypeId) {
                delete formData.accountTypeId;
            }

            // Convertir profit a número decimal
            if (formData.profit) {
                formData.profit = parseFloat(formData.profit);
            }

            if (editIndex !== null) {
                // Obtener el ID del instrumento a editar
                const instrumentId = instruments[editIndex].id;

                // Eliminar propiedades no deseadas al actualizar
                delete formData.id;
                delete formData.publicId;
                delete formData.createdAt;
                delete formData.updatedAt;
                delete formData.bank;
                delete formData.country;
                delete formData.user;
                delete formData.Client;
                delete formData.accountType;

                formData.userId = selectedUser;

                await instanceWithToken.patch(`instruments-client/${instrumentId}`, formData);
                toast.success("Instrumento actualizado correctamente");
            } else {
                formData.userId = selectedUser;

                await instanceWithToken.post("instruments-client", formData);
                toast.success("Instrumento creado correctamente");
            }

            await getInstruments();
            setIsOpen(false);
            resetForm();
        } catch (error) {
            toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch dependent data when country is selected
    useEffect(() => {
        if (formData.countryId) {
            fetchDependentData(formData.countryId);
        } else {
            setAccountTypes([]);
            setBanks([]);
        }
    }, [formData.countryId]);

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

    const getInstruments = async () => {
        try {
            const result = await instanceWithToken.get("instruments-client?useInstruments=PANET");
            setInstruments(result.data.data);
        } catch (error) {
            toast.error("Error al cargar los instrumentos");
        }
    };

    const getCountries = async () => {
        try {
            const result = await instanceWithToken.get("country");
            setCountries(result.data.data);
        } catch (error) {
            toast.error("Error al cargar los países");
        }
    };

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

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm({ ...searchTerm, [name]: value });
    };

    const resetForm = () => {
        setFormData({
            holder: "",
            accountNumber: "",
            accountTypeId: "",
            countryId: "",
            bankId: "",
            typeInstrument: "PAGO_MOVIL",
            profit: ""
        });
        setEditIndex(null);
    };

    const handleEdit = async (index) => {
        setEditIndex(index);
        const instrumentToEdit = instruments[index];
        // Fetch dependent data before setting form data
        if (instrumentToEdit.countryId) {
            await fetchDependentData(instrumentToEdit.countryId);
        }
        setFormData(instrumentToEdit);
        setIsOpen(true);
    };

    const handleDelete = async (index) => {
        try {
            const instrumentId = instruments[index].id;
            await instanceWithToken.delete(`instruments/${instrumentId}`);
            toast.success("Instrumento eliminado correctamente");
            await getInstruments();
        } catch (error) {
            toast.error("Error al eliminar el instrumento");
        }
    };

    const filteredInstruments = instruments.filter((instrument) => {
        return (
            instrument.holder.toLowerCase().includes(searchTerm.holder.toLowerCase()) &&
            (!searchTerm.country || instrument.countryId === searchTerm.country) &&
            (!searchTerm.accountType || instrument.accountTypeId === searchTerm.accountType)
        );
    });

    const INSTRUMENT_TYPES = {
        PAGO_MOVIL: "Pago Móvil",
        CUENTA_BANCARIA: "Cuenta Bancaria",
        CUENTA_DIGITAL: "Cuenta Digital",
        BILLETERA_MOVIL: "Billetera Móvil",
    };

    const getUsers = () => {
        instanceWithToken.get('/user/by-roles/shearch?roles=INTERMEDIARIO,DESPACHADOR,SUPERADMIN,DUEÑO DE CUENTA').then((result) => {
            let users = []

            result.data.data.map((user) => {
                users.push({ label: `${user.user} - ${user.name}`, value: user.id })
            })

            setUsers(users)
        })
    }

    const handleChange = (selectedOption) => {
        setSelectedUser(selectedOption.value)
    }

    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                <div className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold">Administración de Instrumentos</h1>
                </div>
                <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Instrumento
                </Button>
            </div>

            {/* Search */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        className="pl-10 w-full"
                        placeholder="Buscar por titular..."
                        name="holder"
                        value={searchTerm.holder}
                        onChange={handleSearchChange}
                    />
                </div>
                <select
                    name="country"
                    value={searchTerm.country}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                >
                    <option value="">Todos los países</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <select
                    name="accountType"
                    value={searchTerm.accountType}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                >
                    <option value="">Todos los tipos de cuenta</option>
                    {accountTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table Container */}
            <div className="rounded-md border overflow-x-auto bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[200px] font-semibold">Titular</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">Tipo de Cuenta</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">País</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">Tipo de Instrumento</TableHead>
                            <TableHead className="min-w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInstruments.map((instrument, index) => (
                            <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{instrument.holder}</TableCell>
                                <TableCell>{accountTypes.find(type => type.id === instrument.accountTypeId)?.name || "-"}</TableCell>
                                <TableCell>{countries.find(country => country.id === instrument.countryId)?.name || "-"}</TableCell>
                                <TableCell>{INSTRUMENT_TYPES[instrument.typeInstrument] || instrument.typeInstrument}</TableCell>
                                <TableCell className="sticky right-0 bg-white">
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(index)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(index)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editIndex !== null ? "Editar Instrumento" : "Agregar Instrumento"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Country selection first */}
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
                            {isLoading ? "Guardando..." : editIndex !== null ? "Actualizar" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
};

export default InstrumentsPage;