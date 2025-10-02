import { Accordion, AccordionTab } from "primereact/accordion";

interface ListParams {
    presences: PresenceList,
}

const AdminList: React.FC<ListParams> = ({ presences }) => {
    return (
        <div className="border-2 border-t-0 border-[#D0CCD0] overflow-scroll">
            <Accordion multiple>
                {Object.keys(presences).length > 0 ? Object.keys(presences).map((city) => (
                    <AccordionTab key={city} header={`${city} - ${presences[city].total}`}>
                        {
                            presences[city].list.map((presence, index) => (
                                <div key={index.toString()} className="p-2 flex justify-between items-center hover:bg-[#D0CCD0] text-[1rem]">
                                    <span><strong>{index + 1}: {presence.name}</strong> - {presence.document}</span>
                                    <span>{presence.church.fullName}</span>
                                </div>
                            ))
                        }
                    </AccordionTab>
                )) : <span className="p-2">Nenhuma presença registrada!</span>}
            </Accordion>
        </div>
    );
}

export default AdminList;