import React from 'react'
import { NotebookText } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LabelLateral from '@/components/globals/LabelLateral';

const NuevaTransaccion = () => {
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
                
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle>Pais de Destino</CardTitle>
                </CardHeader>
                <CardContent>
                 
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaccion</CardTitle>
                </CardHeader>
                <CardContent>
                 <Input placeholder="Documento del Cliente"  className="mb-1"  />
                 <div className='grid grid-cols'>
                 <LabelLateral title={"Nombre:"}  description={" Armando"} />
                 <LabelLateral title={"Telefono:"} description={" 14214"} />
                 </div>
                 <Button className='w-full  mt-4'>
                   Seleccionar Instrumento
                 </Button>
                 <Input placeholder="Monto a Enviar" className="mb-1 mt-2" />
                 <Input placeholder="Monto a Recibir" className="mb-1 mt-2 mb-4" />
                 <LabelLateral title={"Tasa de Calculo:"}  description={" 14"} />
                </CardContent>
              </Card>

      </div>

    </div>
  )
}

export default NuevaTransaccion