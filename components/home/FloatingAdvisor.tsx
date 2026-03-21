'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function FloatingAdvisor() {
    const t = useTranslations('floatingAdvisor');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex items-stretch transition-transform duration-300 shadow-2xl rounded-l-2xl overflow-hidden group font-display ${isOpen ? 'translate-x-0' : 'translate-x-[14rem] lg:translate-x-[18rem] hover:translate-x-0'
                }`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Tab */}
            <div className="w-10 lg:w-14 bg-primary hover:bg-primary-dark flex flex-col items-center justify-center py-4 lg:py-6 gap-4 lg:gap-6 cursor-pointer relative shadow-lg transition-colors">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined text-white text-base lg:text-xl">support_agent</span>
                </div>
                <span
                    className="text-white font-bold tracking-widest text-[10px] lg:text-xs uppercase whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    {t('title')}
                </span>
            </div>

            {/* Content */}
            <div className="w-[14rem] lg:w-[18rem] bg-white p-4 lg:p-6 flex flex-col justify-center border-l border-white/10">
                {/* Advisor Info */}
                <div className="flex items-center gap-3 mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-gray-100">
                    <div className="relative">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-primary/20">
                            <img
                                alt={t('name')}
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHp3V7DncjNBHsqRUyIrHRICODiJd_NFnI1J612KVjOhotObObF5egygTv-XL3fEmRgnilKbU8uo29VWbCQLGjfSfhZcUlWu5nmvqKm0TzzsT5iNKNtgCL1ysKOMgC9UM_b1UnSUOrFzzJieVmmKsQuhV4MkGAOpjTaIHPix2_Mvgfsq5MGyZH5uSj7B5ZGgxi_PJRXnq-sFz6Hc4yp22ptnDvAIkvBbzmLy0MelVOLyRSVFsTJNhVaysdKKNcbnCU6fBiY1h4Q0nr"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 leading-tight text-xs lg:text-sm">
                            {t('name')}
                        </h4>
                        <p className="text-[10px] lg:text-xs text-primary font-medium">
                            {t('role')}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 lg:space-y-3">
                    <a
                        className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                        href="#"
                    >
                        <span className="material-symbols-outlined text-base lg:text-xl">calendar_add_on</span>
                        <span className="font-bold text-xs lg:text-sm">{t('bookCall')}</span>
                    </a>
                    <a
                        className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20"
                        href="#"
                    >
                        <span className="material-symbols-outlined text-base lg:text-xl">chat</span>
                        <span className="font-bold text-xs lg:text-sm">{t('whatsapp')}</span>
                    </a>
                    <a
                        className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        href="#"
                    >
                        <span className="material-symbols-outlined text-base lg:text-xl">mail</span>
                        <span className="font-bold text-xs lg:text-sm">{t('email')}</span>
                    </a>
                </div>

                {/* Availability */}
                <div className="mt-4 lg:mt-6 text-center">
                    <p className="text-[9px] lg:text-[10px] text-slate-400 uppercase tracking-widest">
                        {t('availability')}
                    </p>
                </div>
            </div>
        </div>
    );
}
