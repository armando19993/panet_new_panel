import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipDate = ({ date }) => {
    const getDateFormat = () => {
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: es,
        });
    };

    const getFormattedTooltipDate = () => {
        return format(new Date(date), "dd-MM-yyyy HH:mm:ss");
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-pointer text-primary hover:underline">
                        {getDateFormat()}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{getFormattedTooltipDate()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipDate;
