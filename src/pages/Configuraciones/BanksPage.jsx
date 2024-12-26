import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Pencil, Trash2, Plus, Landmark, } from "lucide-react";
import { toast } from "sonner";

export const BanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchNameCode, setSearchNameCode] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    countryId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (editIndex !== null) {
        const bankId = banks[editIndex].id;
        await instanceWithToken.patch(`bank/${bankId}`, formData);
        toast.success("Banco actualizado correctamente");
      } else {
        await instanceWithToken.post("bank", formData);
        toast.success("Banco creado correctamente");
      }
      await getBanks();
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
      code: "",
      countryId: "",
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(banks[index]);
    setIsOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const bankId = banks[index].id;
      await instanceWithToken.delete(`bank/${bankId}`);
      toast.success("Banco eliminado correctamente");
      await getBanks();
    } catch (error) {
      toast.error("Error al eliminar el banco");
    }
  };

  const getBanks = async () => {
    try {
      const result = await instanceWithToken.get("bank");
      setBanks(result.data.data);
    } catch (error) {
      toast.error("Error al cargar la lista de bancos");
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
    getBanks();
    getCountries();
  }, []);

  const filteredBanks = banks.filter((bank) => {
    const countryName = countries.find((country) => country.id === bank.countryId)?.name || "";
    const matchesNameCode =
      bank.name.toLowerCase().includes(searchNameCode.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchNameCode.toLowerCase());
    const matchesCountry = searchCountry ? bank.countryId === searchCountry : true;
    return matchesNameCode && matchesCountry;
  });

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">Administración de Bancos</h1>
        </div>
        <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Banco
        </Button>
      </div>

      {/* Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          className="w-full"
          placeholder="Buscar por nombre o código..."
          value={searchNameCode}
          onChange={(e) => setSearchNameCode(e.target.value)}
        />
        <select
          className="w-full border rounded p-2 focus:outline-none focus:ring"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
        >
          <option value="">Filtrar por país</option>
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
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold">Código</TableHead>
              <TableHead className="min-w-[150px] lg:w-[200px] font-semibold">País</TableHead>
              <TableHead className="min-w-[100px] lg:w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBanks.map((bank, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium min-w-[150px]">{bank.name}</TableCell>
                <TableCell className="min-w-[100px]">{bank.code}</TableCell>
                <TableCell className="min-w-[150px]">{
                  countries.find((country) => country.id === bank.countryId)?.name || "-"
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
            <DialogTitle>{editIndex !== null ? "Editar Banco" : "Agregar Banco"}</DialogTitle>
          </DialogHeader>
          {/* Form */}
          <div className="grid grid-cols-1 gap-4">
            <Label>
              Nombre
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre del banco"
              />
            </Label>
            <Label>
              Código
              <Input
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Código del banco"
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

export default BanksPage;
