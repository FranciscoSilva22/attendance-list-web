import { useAppSelector } from "@/hooks/redux";
import api from "@/services/api";
import { useMemo, useRef, useState } from "react";
import { InputMask } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from "primereact/progressspinner";

interface ModalProps {
    open: boolean;
    handleClose: () => void;
    handlePresence: (presence: Presence) => void;
    editRegister: Presence | null;
}

const Modal: React.FC<ModalProps> = ({ open, handleClose, handlePresence, editRegister }) => {
    const { token } = useAppSelector(state => state.auth);
    const [continueRegister, setContinueRegister] = useState(true);
    const toast = useRef<Toast>(null);

    const [loading, setLoading] = useState(false);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const document = formData.get('document') as string;

        try {
            const action = editRegister ? api.put : api.post;
            let route = "/presence";

            if (editRegister)
                route += `/${editRegister.id}`;

            const { data } = await action(
                route,
                { name, document },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            handlePresence(data.presence);

            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Registro criado!' });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar registro' });
        }

        form.reset();
        if(!continueRegister)
            handleClose();

        setLoading(false);
    }

    const modalClasses = useMemo(() => {
        let r = "absolute w-screen h-screen bg-[#00000090] flex items-center justify-center";
        if(!open) {
            r += " hidden";
        }

        return r;
    }, [open]);

    return (
        <div className={modalClasses}>
            <Toast ref={toast} />

            <div className=" w-[90%] h-[50%] lg:w-[30%] lg:h-[35%] rounded-sm bg-white relative">
                <button
                    className="flex items-center justify-center absolute right-2 top-2 cursor-pointer rounded-sm border-[#FE6D73] border-2 p-1 text-[12px] text-[#FE6D73]"
                    onClick={handleClose}
                >
                    <i className="pi pi-times"></i>
                </button>
                <form onSubmit={handleAdd} className="flex flex-col w-[100%] h-[100%] items-center justify-center">
                    <input
                        name="name"
                        className="w-[90%] border-2 border-[#D0CCD0] mb-5 p-2 rounded-sm"
                        placeholder="Nome"
                        type="text"
                        defaultValue={editRegister?.name}
                    />
                    <InputMask
                        name="document"
                        className="w-[90%] border-2 border-[#D0CCD0] p-2 rounded-sm"
                        placeholder="RG"
                        type="text"
                        value={editRegister?.document}
                        mask="99.999.999-9"
                    />

                    <div className="flex gap-2 mt-5 self-end mr-8">
                        <input
                            id="chk-continue"
                            type="checkbox"
                            name="continue-register"
                            checked={continueRegister}
                            onChange={e => setContinueRegister(e.target.checked)}
                        />
                        <label htmlFor="chk-continue">Continuar Registrando?</label>
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer mt-6 bg-[#17C3B2] w-[80%] p-2 rounded-md text-[#FBFCFF] font-bold border-2 border-[#D0CCD0]"
                    >
                        {
                            loading ? <ProgressSpinner style={{ width: 25, height: 25 }} strokeWidth="8" /> : "Registrar"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Modal;