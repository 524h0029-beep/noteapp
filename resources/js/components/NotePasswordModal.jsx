import React, { useState } from 'react';
import axios from 'axios';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotePasswordModal({ note, mode, onClose, onSuccess }) {
    const { user } = useAuth();
    const isDark = user?.theme === 'dark';

    // mode: 'verify' | 'set' | 'change' | 'remove'
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (mode === 'verify') {
                await axios.post(`/api/notes/${note.id}/verify-password`, { password });
                onSuccess();

            } else if (mode === 'set') {
                if (password !== passwordConfirm) {
                    setError('Mật khẩu xác nhận không khớp');
                    setLoading(false);
                    return;
                }
                await axios.post(`/api/notes/${note.id}/set-password`, {
                    password,
                    password_confirmation: passwordConfirm,
                });
                onSuccess();

            } else if (mode === 'change') {
                if (!currentPassword) {
                    setError('Vui lòng nhập mật khẩu hiện tại');
                    setLoading(false);
                    return;
                }
                if (password !== passwordConfirm) {
                    setError('Mật khẩu mới xác nhận không khớp');
                    setLoading(false);
                    return;
                }
                await axios.post(`/api/notes/${note.id}/change-password`, {
                    current_password: currentPassword,
                    new_password: password,
                    new_password_confirmation: passwordConfirm,
                });
                onSuccess();

            } else if (mode === 'remove') {
                await axios.post(`/api/notes/${note.id}/remove-password`, { password });
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const config = {
        verify: { title: 'Xác minh mật khẩu', icon: '🔒', btn: 'Mở khóa', color: 'bg-indigo-500 hover:bg-indigo-600' },
        set:    { title: 'Đặt mật khẩu', icon: '🔑', btn: 'Xác nhận', color: 'bg-indigo-500 hover:bg-indigo-600' },
        change: { title: 'Đổi mật khẩu', icon: '🔑', btn: 'Đổi mật khẩu', color: 'bg-amber-500 hover:bg-amber-600' },
        remove: { title: 'Tắt mật khẩu', icon: '🔓', btn: 'Tắt khóa', color: 'bg-rose-500 hover:bg-rose-600' },
    }[mode];

    const base = `w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`;
    const inputCls = `${base} ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'border-slate-200 placeholder-slate-300'}`;

    const Field = ({ label, value, onChange, autoFocus = false }) => (
        <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {label}
            </label>
            <div className="relative">
                <Lock size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                    type={showPass ? 'text' : 'password'}
                    className={inputCls}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    autoFocus={autoFocus}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden
                ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>

                {/* Header */}
                <div className={`flex justify-between items-center px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{config.title}</h2>
                    </div>
                    <button onClick={onClose} className={`p-1.5 rounded-lg transition ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                        <X size={15} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-3 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* mode=change: nhập mật khẩu HIỆN TẠI trước */}
                    {mode === 'change' && (
                        <Field
                            label="Mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            autoFocus
                        />
                    )}

                    {/* Tất cả mode đều có field mật khẩu chính */}
                    <Field
                        label={mode === 'change' ? 'Mật khẩu mới' : mode === 'remove' ? 'Nhập mật khẩu để xác nhận' : 'Mật khẩu'}
                        value={password}
                        onChange={setPassword}
                        autoFocus={mode !== 'change'}
                    />

                    {/* mode=set hoặc change: cần xác nhận mật khẩu */}
                    {(mode === 'set' || mode === 'change') && (
                        <Field
                            label={mode === 'change' ? 'Xác nhận mật khẩu mới' : 'Xác nhận mật khẩu'}
                            value={passwordConfirm}
                            onChange={setPasswordConfirm}
                        />
                    )}

                    {/* Hint cho mode remove */}
                    {mode === 'remove' && (
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Nhập mật khẩu hiện tại để xác nhận tắt bảo vệ.
                        </p>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button onClick={onClose}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition
                                ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !password || (mode === 'change' && (!currentPassword || !passwordConfirm)) || (mode === 'set' && !passwordConfirm)}
                            className={`flex-1 ${config.color} text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50`}>
                            {loading ? 'Đang xử lý...' : config.btn}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
