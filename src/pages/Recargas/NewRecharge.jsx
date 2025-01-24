import React from 'react';
import { NotebookText } from "lucide-react";


const NewRecharge = () => {




  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">
            Nueva Recarga
          </h1>
        </div>
      </div>


      {/* MAIN */}
      <form action="">
        <div  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div>
            PAISES
          </div>

          <div>
          <input
            type="text"
            placeholder="Ingrese Monto a Recargar"
            className="w-full mt-4 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

          />
          <input
            type="text"
            placeholder="Ingrese Comentario"
            className="w-full mt-4 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className='flex '>
            <input
              type="text"
              placeholder="Ingrese Referencia"
              className="w-80 mt-4 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Ingrese Fecha"
              className="w-80  mt-4 ml-2 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <img className='w-full  mt-4 p-20  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          </div>
        </div>
         <footer>
          <button className='w-full  mt-4'>
              Enviar
          </button>
         </footer> 
      </form>

      </div>




  )
}

export default NewRecharge