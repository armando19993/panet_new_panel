import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Pencil, Trash2, Plus, Layers, Search } from "lucide-react";
import { toast } from "sonner";

export const AccountTypesPage = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState({ name: "", country: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    countryId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm({ ...searchTerm, [name]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (editIndex !== null) {
        const typeId = accountTypes[editIndex].id;
        await instanceWithToken.patch(`account-type/${typeId}`, formData);
        toast.success("Tipo de cuenta actualizado correctamente");
      } else {
        await instanceWithToken.post("account-type", formData);
        toast.success("Tipo de cuenta creado correctamente");
      }
      await getAccountTypes();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      countryId: "",
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(accountTypes[index]);
    setIsOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const typeId = accountTypes[index].id;
      await instanceWithToken.delete(`account-type/${typeId}`);
      toast.success("Tipo de cuenta eliminado correctamente");
      await getAccountTypes();
    } catch (error) {
      toast.error("Error al eliminar el tipo de cuenta");
    }
  };

  const getAccountTypes = async () => {
    try {
      const result = await instanceWithToken.get("account-type");
      setAccountTypes(result.data.data);
    } catch (error) {
      toast.error("Error al cargar la lista de tipos de cuenta");
    }
  };

  const getCountries = async () => {
    try {
      const result = await instanceWithToken.get("country");
      setCountries(result.data.data);
    } catch (error) {
      toast.error("Error al cargar la lista de países");
    }
  };

  useEffect(() => {
    getAccountTypes();
    getCountries();
  }, []);

  const filteredAccountTypes = accountTypes.filter((type) => {
    const country = countries.find((country) => country.id === type.countryId);
    return (
      type.name.toLowerCase().includes(searchTerm.name.toLowerCase()) &&
      (!searchTerm.country || country?.id === searchTerm.country)
    );
  });

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">Administración de Tipos de Cuenta</h1>
        </div>
        <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Tipo de Cuenta
        </Button>
      </div>

      {/* Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 w-full"
            placeholder="Buscar por nombre..."
            name="name"
            value={searchTerm.name}
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
              {country.name} ({country.code})
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="rounded-md border overflow-x-auto bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[150px] lg:w-[200px] font-semibold">Nombre</TableHead>
              <TableHead className="min-w-[150px] lg:w-[200px] font-semibold">País</TableHead>
              <TableHead className="min-w-[100px] lg:w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccountTypes.map((type, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium min-w-[150px]">{type.name}</TableCell>
                <TableCell className="min-w-[150px]">{
                  countries.find((country) => country.id === type.countryId)?.name || "-"
                }</TableCell>
                <TableCell className="min-w-[100px] sticky right-0 bg-white">
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
            <DialogTitle>{editIndex !== null ? "Editar Tipo de Cuenta" : "Agregar Tipo de Cuenta"}</DialogTitle>
          </DialogHeader>
          {/* Form */}
          <div className="grid grid-cols-1 gap-4">
            <Label>
              Nombre
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre del tipo de cuenta"
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
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </Label>
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
              disabled={isLoading}
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

export default AccountTypesPage;
