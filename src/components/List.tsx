interface ListParams {
    presences: Presence[],
    removeRegister: (id: number) => void;
    editRegister: (p: Presence) => void;
}

const List: React.FC<ListParams> = ({ presences, editRegister, removeRegister }) => {
    return (
        <div className="border-2 border-t-0 border-[#D0CCD0] overflow-scroll">
            {presences.length > 0 ? presences.map((presence, index) => (
                <div key={index.toString()} className="p-2 flex justify-between items-center hover:bg-[#D0CCD0] text-[1rem]">
                    <span><strong>{index + 1}: {presence.name}</strong> - {presence.document}</span>

                    <div className="flex gap-2">
                        <button
                            className="flex items-center justify-center cursor-pointer rounded-sm border-[#FE6D73] border-2 p-1 text-[#FE6D73]"
                            onClick={() => removeRegister(presence.id)}
                        >
                            <i className="pi pi-trash"></i>
                        </button>
                        <button
                            className="flex items-center justify-center cursor-pointer rounded-sm border-[#F18F01] border-2 p-1 text-[#F18F01]"
                            onClick={() => editRegister(presence)}
                        >
                            <i className="pi pi-pencil"></i>
                        </button>
                    </div>
                </div>
            )) : <span className="p-2">Nenhuma presença registrada!</span>}
        </div>
    );
}

export default List;