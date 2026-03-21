'use client';

import { useTranslations } from 'next-intl';

export function ContactSection() {
    const t = useTranslations('contact');

    const timeSlots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'];

    return (
        <section className="py-16 sm:py-24 bg-background-light border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {t('title')} <br className="hidden md:block" />
                        {t('titleLine2')}
                    </h2>
                    <p className="mt-4 text-slate-600 max-w-2xl text-sm sm:text-base">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8 flex flex-col h-full">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">mail</span>
                            {t('form.title')}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4 sm:mb-6">
                            {t('form.subtitle')}
                        </p>

                        <form className="space-y-4 sm:space-y-5 flex-grow">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {t('form.fullName')}
                                </label>
                                <input
                                    className="w-full bg-background-light border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    placeholder={t('form.fullNamePlaceholder')}
                                    type="text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {t('form.email')}
                                </label>
                                <input
                                    className="w-full bg-background-light border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    placeholder={t('form.emailPlaceholder')}
                                    type="email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {t('form.city')}
                                </label>
                                <input
                                    className="w-full bg-background-light border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    placeholder={t('form.cityPlaceholder')}
                                    type="text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {t('form.phone')}
                                </label>
                                <input
                                    className="w-full bg-background-light border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    placeholder={t('form.phonePlaceholder')}
                                    type="tel"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {t('form.interest')}
                                </label>
                                <div className="relative">
                                    <select className="w-full bg-background-light border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none text-sm">
                                        <option>{t('form.culinaryArts')}</option>
                                        <option>{t('form.pastryArts')}</option>
                                        <option>{t('form.hospitality')}</option>
                                        <option>{t('form.wine')}</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {t('form.message')}
                                </label>
                                <textarea
                                    className="w-full bg-background-light border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm"
                                    placeholder={t('form.messagePlaceholder')}
                                    rows={4}
                                ></textarea>
                            </div>

                            <button className="w-full py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-2">
                                {t('form.submit')}
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </form>

                        {/* Offices */}
                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                {t('offices.title')}
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-1 text-lg">location_on</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{t('offices.paris.name')}</p>
                                        <p className="text-xs text-slate-500">{t('offices.paris.address')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-1 text-lg">location_on</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{t('offices.bangkok.name')}</p>
                                        <p className="text-xs text-slate-500">{t('offices.bangkok.address')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4 ml-9">
                                    <a className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" href="#">
                                        <span className="material-symbols-outlined text-sm">public</span>
                                    </a>
                                    <a className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" href="#">
                                        <span className="material-symbols-outlined text-sm">group</span>
                                    </a>
                                    <a className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" href="#">
                                        <span className="material-symbols-outlined text-sm">videocam</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Booking */}
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                {t('booking.title')}
                            </h3>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">
                                {t('booking.badge')}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 sm:mb-8">
                            {t('booking.subtitle')}
                        </p>

                        {/* Calendar */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h4 className="text-base sm:text-lg font-bold text-slate-900">{t('booking.month')}</h4>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-sm text-center font-medium">
                                {[...Array(31)].map((_, i) => {
                                    const day = i + 1;
                                    const isSelected = day === 16;
                                    const isPast = day < 1;
                                    return (
                                        <span
                                            key={i}
                                            className={`p-2 rounded cursor-pointer transition-colors ${isSelected
                                                    ? 'bg-primary text-white rounded-full shadow-lg shadow-primary/30 font-bold'
                                                    : isPast
                                                        ? 'text-gray-300'
                                                        : 'text-slate-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            {day}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-4">{t('booking.selectedDate')}</h4>
                            <div className="space-y-3">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        className="w-full px-4 py-3 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 rounded-lg text-sm font-bold text-slate-700 hover:text-primary transition-all flex items-center justify-between group"
                                    >
                                        <span>{time}</span>
                                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
