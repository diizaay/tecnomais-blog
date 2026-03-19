import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar theme="light" />
            
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px]">Our Mission</span>
                        <h1 className="text-[48px] md:text-[72px] font-extrabold tracking-tight text-[#1d1d1f] leading-[1.1] mt-6 mb-10">
                            The future of tech, explained.
                        </h1>
                        <p className="text-[22px] md:text-[28px] text-[#86868b] leading-relaxed font-medium">
                            TecnoMais is Angola's premier platform for deep insights into artificial intelligence, productivity software, and the evolving digital landscape.
                        </p>
                    </div>


                    <div className="grid lg:grid-cols-2 gap-20 max-w-6xl mx-auto">
                        <div className="space-y-8">
                            <h3 className="text-[32px] font-bold text-[#1d1d1f]">Who is Tecno+?</h3>
                            <p className="text-[18px] text-[#424245] leading-relaxed">
                                Tecno+ is the editorial collective behind TecnoMais. We are a group of developers, data scientists, and digital enthusiasts committed to bringing high-quality, actionable tech news to the world.
                            </p>
                            <p className="text-[18px] text-[#424245] leading-relaxed">
                                Born in Luanda - Angola, our vision is to bridge the gap between global innovations and local implementation, providing our readers with the tools they need to stay ahead in an increasingly automated world.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-[32px] font-bold text-[#1d1d1f]">Why We Exist</h3>
                            <ul className="space-y-6">
                                {[
                                    { title: 'Curation over Noise', desc: 'We filter the endless stream of tech news to deliver only what truly matters to your career and business.' },
                                    { title: 'In-depth Analysis', desc: 'We don\'t just report what happened; we explain why it matters and how it affects the future.' },
                                    { title: 'Digital Inclusion', desc: 'Advancing the digital conversation in Angola and beyond, making complex topics accessible to everyone.' }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-2 bg-[#0066cc] rounded-full shrink-0"></div>
                                        <div>
                                            <h4 className="font-bold text-[18px] text-[#1d1d1f]">{item.title}</h4>
                                            <p className="text-[#86868b] mt-1">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
