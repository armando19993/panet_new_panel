import { instanceWithToken } from '@/utils/instance';
import { NotebookText } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const DetailRecharge = () => {
    const { idrecarga } = useParams();

    const getRecharge = () => {
        instanceWithToken.get(`recharge/${idrecarga}`).then((result) => {
            console.log(result.data.data)
        })
    }

    useEffect(() => {
        getRecharge()
    }, [])

    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                <div className="flex items-center gap-2">
                    <NotebookText className="h-6 w-6 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold">
                        Detalle de Recarga
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default DetailRecharge