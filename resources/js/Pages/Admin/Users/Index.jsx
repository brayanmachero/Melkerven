import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ users }) {
    const updateRole = (userId, newRole) => {
        router.patch(route('admin.users.updateRole', userId), { role: newRole }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Gestión de Acceso</span>
                    </div>
                    <h2 className="text-4xl font-display font-medium text-white tracking-tighter">
                        Usuarios <span className="text-accent-500">Registrados</span>
                    </h2>
                </div>
            }
        >
            <Head title="Usuarios - Admin" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="tech-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">ID</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Nombre</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Email</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">RUT</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Teléfono</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Rol</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.data.map(user => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6 font-mono text-xs text-primary-500">{user.id}</td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-white font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-primary-300 font-mono">{user.email}</td>
                                            <td className="p-6 text-sm text-primary-400 font-mono">{user.rut || '—'}</td>
                                            <td className="p-6 text-sm text-primary-400">{user.phone || '—'}</td>
                                            <td className="p-6">
                                                <select
                                                    value={user.role || 'user'}
                                                    onChange={(e) => updateRole(user.id, e.target.value)}
                                                    className={`bg-primary-950 border rounded-lg text-xs px-3 py-1.5 focus:border-accent-500 focus:ring-accent-500/20 ${user.role === 'admin' ? 'border-accent-500/30 text-accent-400' : 'border-white/10 text-white'
                                                        }`}
                                                >
                                                    <option value="user">Usuario</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </td>
                                            <td className="p-6 text-[10px] text-primary-500">{new Date(user.created_at).toLocaleDateString('es-CL')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {users.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {users.links.map((link, i) => (
                                link.url ? (
                                    <a key={i} href={link.url} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-lg ${link.active ? 'bg-accent-500 border-accent-500 text-white' : 'border-white/10 text-primary-400 hover:border-accent-500'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={i} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-primary-600 cursor-not-allowed opacity-50 rounded-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
