import Pagination from "@/components/ui/Pagination";


export default function OverviewList({data}) {


    return(
        <div className="bg-white rounded-3xl border border-(--color-border-agro) p-6 flex flex-col w-full h-full shadow-sm">
           <div className="flex flex-col items-center justify-center w-full gap-4 py-4">
               <Pagination totalRegistros={3} totalPaginas={2} paginaActual={1} limite={3} />
            </div>
        </div>
    );
}
