import { portfolioData } from '../../data';
import { MagneticButton } from '../layout/MagneticButton';

export const Footer = () => {
    return (
        <section id="contact" className="relative w-full bg-[#1C1D20] text-white pt-[120px] pb-[32px] px-4 md:px-[150px] flex flex-col z-0 overflow-hidden">
            <div className="w-full flex-grow flex flex-col">

                {/* Top huge header row */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-[40px] mb-[120px]">
                    <img
                        src={portfolioData.personal.profileImage}
                        alt="Profile mini"
                        className="w-[80px] h-[80px] rounded-full object-cover"
                    />
                    <h2 className="text-[12vw] md:text-[9vw] leading-[0.8] font-normal tracking-tight ml-[-0.03em]">
                        Let's work<br />together
                    </h2>
                </div>

                {/* Middle divider and giant button */}
                <div className="relative w-full h-[1px] bg-white/20 mb-[100px]">
                    <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-20">
                        <MagneticButton className="w-[180px] h-[180px] rounded-full bg-[#455CE9] flex items-center justify-center text-[16px] font-normal cursor-pointer shadow-2xl hover:bg-[#324CDD] transition-colors duration-300 z-30">
                            <span className="text-white">Get in touch</span>
                        </MagneticButton>
                    </div>
                </div>

                {/* Contact Pills */}
                <div className="flex flex-col md:flex-row gap-4 mb-[120px] z-10 w-fit">
                    <MagneticButton>
                        <a href={`mailto:${portfolioData.personal.email}`} className="px-[32px] py-[22px] rounded-[32px] border border-white/20 text-[16px] font-normal hover:bg-white hover:text-[#1C1D20] transition-colors duration-300 inline-block text-center min-w-[200px]">
                            {portfolioData.personal.email}
                        </a>
                    </MagneticButton>
                    <MagneticButton>
                        <a href={`tel:${portfolioData.personal.phone}`} className="px-[32px] py-[22px] rounded-[32px] border border-white/20 text-[16px] font-normal hover:bg-white hover:text-[#1C1D20] transition-colors duration-300 inline-block text-center min-w-[200px]">
                            {portfolioData.personal.phone}
                        </a>
                    </MagneticButton>
                </div>

                {/* Bottom Row */}
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end text-[16px] font-normal gap-12 md:gap-8 border-t border-t-white/10 pt-4">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                        <div className="flex flex-col gap-1">
                            <span className="uppercase tracking-[0.1em] text-[11px] text-white/40 mb-1">Version</span>
                            <span>2024 © Edition</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="uppercase tracking-[0.1em] text-[11px] text-white/40 mb-1">Local time</span>
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} GMT</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="uppercase tracking-[0.1em] text-[11px] text-white/40 mb-1">Socials</span>
                        <div className="flex gap-8">
                            {portfolioData.socials.map((social) => (
                                <MagneticButton key={social.label}>
                                    <a href={social.url} className="hover:opacity-100 transition-opacity flex items-center gap-1 group relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-white before:scale-x-0 before:origin-right hover:before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300">
                                        {social.label}
                                    </a>
                                </MagneticButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
