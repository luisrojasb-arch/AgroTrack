import {getTareasSaludAction, getResumenSaludLotesAction, getResumenSaludAnimalesAction} from "@/actions/salud.actions";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";


export default async function HealthTableContainer() {
    const tareas = await getTareasSaludAction({ page: 1, limit: 10});
    const resumenLotes = await getResumenSaludLotesAction({ page: 1, limit: 10, search: "" });
    const resumenAnimales = await getResumenSaludAnimalesAction({ page: 1, limit: 10, search: "" });
    console.log(tareas);
    console.log(resumenLotes);
    console.log(resumenLotes.data.registros)
    console.log(resumenAnimales);
    console.log(resumenAnimales.data.registros)
    return (
        <div></div>
    );
}