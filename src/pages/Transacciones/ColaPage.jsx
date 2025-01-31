import React, { useEffect, useState } from 'react';
import { instanceWithToken } from '@/utils/instance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, RailSymbol, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { default as SelectAutomatic } from 'react-select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ColaPage = () => {
  const [cola, setCola] = useState([]);
  const [filteredCola, setFilteredCola] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [tipoT, setTipoT] = useState(null);
  const [idT, setIdT] = useState(null);
  const [idTT, setIdTT] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    encargado: '',
    publicId: ''
  });

  const getUsers = () => {
    instanceWithToken.get('/user/by-roles/shearch?roles=DESPACHADOR').then((result) => {
      let users = [];

      result.data.data.map((user) => {
        users.push({ label: `${user.user} - ${user.name}`, value: user.id });
      });

      setUsers(users);
    });
  };

  const handleChange = (selectedOption) => {
    setSelectedUser(selectedOption.value);
  };

  const getCola = async () => {
    try {
      const result = await instanceWithToken.get('cola-espera?status=INICIADA');
      setCola(result.data.data);
      setFilteredCola(result.data.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...cola];

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.encargado) {
      filtered = filtered.filter(item => item.user.name.toLowerCase().includes(filters.encargado.toLowerCase()));
    }

    if (filters.publicId) {
      filtered = filtered.filter(item => {
        const publicId = item.recharge ? 'REC-2025-' + item.recharge.publicId : 'TRX-2025-' + item.transaction.publicId;
        return publicId.toLowerCase().includes(filters.publicId.toLowerCase());
      });
    }

    setFilteredCola(filtered);
  };

  const handleFilterChange = (value, filterType) => {
    if (value === 'ALL') {
      value = '';
    }
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const transferTransaction = (id, publicId, tipo) => {
    setTipoT(tipo);
    setIdT(publicId);
    setIdTT(id);
    setModalShow(true);
  };

  const transferir = () => {
    instanceWithToken.post('transaction/transferir', { id: idTT, userId: selectedUser }).then((result) => {
      setModalShow(false);
      toast.success("Transacción transferida correctamente");
      getCola();
    });
  };

  const eliminarTransaccion = (id) => {
    instanceWithToken.patch('cola-espera/' + id, {
      status: 'CERRADA'
    }).then((result) => {
      getCola();
    });
  };

  useEffect(() => {
    getCola();
    getUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, cola]);

  const renderTransactionInfo = (item) => {
    if (item.type === 'TRANSACCION' && item.transaction) {
      return (
        <>
          <TableCell>
            {item.transaction.montoOrigen} {item.transaction.monedaOrigen} →{' '}
            {item.transaction.montoDestino} {item.transaction.monedaDestino}
          </TableCell>
          <TableCell>{item.transaction.destino?.name || '-'}</TableCell>
        </>
      );
    }
    return (
      <>
        <TableCell>{item.recharge?.amount || '-'}</TableCell>
        <TableCell>-</TableCell>
      </>
    );
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold">Cola de Espera</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <Select onValueChange={(value) => handleFilterChange(value, 'type')} className="w-[100%] md:w-[48%]">
            <SelectTrigger className="w-[100%]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value="TRANSACCION">Transacción</SelectItem>
              <SelectItem value="RECARGA">Recarga</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Filtrar por Encargado"
            className="w-[100%] md:w-[48%] p-2 border rounded"
            onChange={(e) => handleFilterChange(e.target.value, 'encargado')}
          />

          <input
            type="text"
            placeholder="Filtrar por Public ID"
            className="w-[100%] md:w-[48%] p-2 border rounded"
            onChange={(e) => handleFilterChange(e.target.value, 'publicId')}
          />
        </CardContent>
      </Card>

      <div className="rounded-md border overflow-x-auto bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Encargado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCola.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.recharge ? 'REC-2025-' + item.recharge.publicId : 'TRX-2025-' + item.transaction.publicId}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${item.status === 'INICIADA' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'CERRADA' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {item.status}
                  </span>
                </TableCell>
                {renderTransactionInfo(item)}
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>
                  <Button onClick={() => transferTransaction(item.id, item.publicId, item.type)} variant="ghost" >
                    <RailSymbol />
                  </Button>
                  {item.status === 'INICIADA' && <Button onClick={() => eliminarTransaccion(item.id)} variant="ghost" >
                    <Trash2 />
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalShow} onOpenChange={setModalShow}>
        <DialogContent className="w-[95vw] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transferir Transacción: {tipoT}-{idT}</DialogTitle>
          </DialogHeader>

          <Label className="mt-5 mb-5">
            Dueño de cuenta:
            <SelectAutomatic
              onChange={handleChange}
              options={users}
              className="basic-single mt-5"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              placeholder="Selecciona un usuario..."
            />
          </Label>

          <Button onClick={() => { transferir() }} >Procesar Transferencia</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColaPage;