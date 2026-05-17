import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        if (password !== passwordConfirm) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false); return;
        }
        try {
            await register(name, email, password, passwordConfirm);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-indigo-300 blur-3xl" />
                </div>
                <div className="relative flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                    </div>
                    <span className="text-white font-bold text-xl">NoteApp</span>
                </div>
                <div className="relative">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">Bắt đầu<br />ngay hôm nay</h2>
                    <p className="text-indigo-200 text-base">Miễn phí. Không giới hạn. Bảo mật tuyệt đối.</p>
                </div>
                <p className="relative text-indigo-300 text-sm">© 2026 NoteApp</p>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">N</span>
                        </div>
                        <span className="text-slate-800 font-bold text-lg">NoteApp</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Tạo tài khoản</h1>
                    <p className="text-slate-400 text-sm mb-8">Điền thông tin để bắt đầu</p>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Tên hiển thị */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tên hiển thị</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
                                    placeholder="Nguyễn Văn A"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="email"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mật khẩu</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type={showPass ? 'text' : 'password'}
                                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="password"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
                                    placeholder="Nhập lại mật khẩu"
                                    value={passwordConfirm}
                                    onChange={e => setPasswordConfirm(e.target.value)}
                                    required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-60 mt-2">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang tạo tài khoản...</>
                            ) : (
                                <>Đăng ký<ArrowRight size={15} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-indigo-500 hover:text-indigo-700 font-semibold">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}