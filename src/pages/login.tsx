import api from "@/services/api";
import { login } from "@/store/auth";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from 'primereact/toast';
import { useRef, useState } from "react";
import type { AxiosError } from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector<Store>((state) => state.auth.token);
    const toast = useRef<Toast>(null);

    const [loading, setLoading] = useState(false);

    if(token)
        navigate({to: "/"});

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const { data }  = await api.post("/login", { username, password });

            form.reset();

            console.log(data);

            dispatch(login({ token: data.value, user: data.user }));
            navigate({ to: "/" });
        } catch (err) {
            const error = err as AxiosError;

            if(error.response?.status == 404)
                toast.current?.show({ severity: 'warn', summary: 'Credenciais inválidas', detail: 'Tente novamente ou contate o suporte' });
            else
                toast.current?.show({ severity: 'error', summary: 'Erro no login', detail: 'Contate o suporte' });
        }

        setLoading(false);
    }

    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <Toast ref={toast} />
            <div className="w-[100%] h-[100%] lg:w-[30%] lg:h-[40%] border-2 border-[#D0CCD0] rounded-sm bg-[#1C6E8C]">
                <form onSubmit={handleLogin} className="flex flex-col w-[100%] h-[100%] items-center justify-center">
                    <input name="username" className="w-[80%] bg-[#FBFCFF] mb-5 p-5 rounded-sm" placeholder="Usuário" type="text" />
                    <input name="password" className="w-[80%] bg-[#FBFCFF] p-5 rounded-sm" placeholder="Senha" type="password" />

                    <button type="submit" disabled={loading} className="cursor-pointer mt-6 bg-[#41BBD9] w-[80%] p-3 rounded-md text-[#FBFCFF] font-bold border-1 border-[#D0CCD0]">
                        {
                            loading ? <ProgressSpinner style={{ width: 25, height: 25 }} strokeWidth="8" /> : "Entrar"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;