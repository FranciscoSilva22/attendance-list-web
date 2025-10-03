import AdminList from "@/components/AdminList";
import List from "@/components/List";
import Modal from "@/components/Modal";
import { useAppSelector } from "@/hooks/redux";
import api from "@/services/api";
import { logout } from "@/store/auth";
import { useNavigate } from "@tanstack/react-router";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Home = () => {
    const { token, user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    if(!token)
        navigate({to: "/login"});

    const [presences, setPresences] = useState<Presence[]>([]);
    const [add, setAdd] = useState(false);
    const [editRegister, setEditRegister] = useState<Presence | null>(null);

    async function getPresenceList() {
        setLoading(true);
        try {
            let route = "presence";

            if(user?.isAdmin)
                route += "/all";

            const { data } = await api.get(route, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPresences(data.presences);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    async function removePeople(id: number) {
        try {
            await api.delete(
                `presence/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setPresences(presences.filter(p => p.id != id));   
        } catch (error) {
            console.log(error);
        }
    }

    function addPresence(presence: Presence) {
        if(editRegister) {
            setPresences(presences.map(pr => pr.id == presence.id ? presence : pr));
            setEditRegister(null);
        } else
            setPresences([...presences, presence]);
    }
    
    function handleEdit(presence: Presence) {
        setEditRegister(presence);
        setAdd(true);
    }

    useEffect(() => {
        getPresenceList();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate({to: "/login"});
    }

    return (
        <div className="flex flex-col w-screen h-screen overflow-hidden pb-2">
            <Modal open={add} handleClose={() => setAdd(false)} handlePresence={addPresence} editRegister={editRegister} />
            <div className="flex justify-between p-5 mb-2 bg-[#274156]">
                <span className="text-[#FBFCFF] font-bold">Olá, {`${user?.fullName} ${user?.city && ` - ${user.city}`}`}</span>
                <button
                    className="text-[#FBFCFF] font-bold text-[14px] cursor-pointer"
                    onClick={handleLogout}
                >
                    <i className="pi pi-angle-double-left"></i>
                </button>
            </div>

            <div className="flex flex-col flex-1 mx-2 md:w-[60%] md:mx-auto rounded-sm overflow-hidden">
                <div className="flex flex-row items-center justify-between bg-[#1C6E8C] p-1 text-[#FBFCFF]">
                    <h2 className="font-bold text-[1.5rem]">Lista de Presença</h2>
                    {
                        !user?.isAdmin && (
                            <button
                                className="flex items-center justify-center bg-[#17C3B2] font-bold p-2 rounded-md text-[14px] cursor-pointer"
                                onClick={() => setAdd(true)}
                            >
                                <i className="pi pi-plus"></i>
                            </button>
                        )
                    }
                </div>

                {
                    loading
                        ? <Message severity="info" text="Carregando..." />
                        : (
                            <>
                                {
                                    user?.isAdmin
                                        ? <AdminList
                                                presences={presences as unknown as PresenceList}
                                            />
                                        : <List
                                            presences={presences}
                                            editRegister={handleEdit}
                                            removeRegister={removePeople}
                                        />
                                }
                            </>
                        )
                }
            </div>
        </div>
    );
}

export default Home;