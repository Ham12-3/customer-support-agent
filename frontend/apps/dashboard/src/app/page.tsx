'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
// import { LandingGlobe } from '@/components/LandingGlobe';
import { SplineHero } from '@/components/SplineHero';
import { ArrowRight, CheckCircle, MessageSquare, Zap, Globe, Star, ChevronLeft, ChevronRight, Clock, Quote, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock Data for Testimonials
const testimonials = [
  {
    id: 1,
    quote: "NexusAI completely transformed our support workflow. Response times dropped by 80% overnight.",
    author: "Sarah Chen",
    role: "CTO, TechFlow",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: 2,
    quote: "The AI agents are indistinguishable from humans. Our customers are happier than ever.",
    author: "Michael Ross",
    role: "VP of Support, GlobalScale",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: 3,
    quote: "Seamless integration with our existing stack. It just works, like magic.",
    author: "Elena Rodriguez",
    role: "Product Lead, Innovate",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces"
  }
];

// Logos - using high quality SVGs with reliable CDN sources
const logos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Meta", src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png" },
  { name: "AWS", src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Netflix", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
];

// Logo component with error handling
function LogoItem({ logo, index }: { logo: typeof logos[0]; index: number }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.5 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ opacity: 1, scale: 1.1, filter: 'brightness(1.2)' }}
      className="grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
    >
      {!imageError ? (
        <div className="relative h-8 md:h-10 w-auto min-w-[80px]">
          <Image 
            src={logo.src}
            alt={logo.name}
            fill
            className="object-contain brightness-200 hover:brightness-100 transition-all duration-300"
            unoptimized
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <span className="text-sm font-semibold text-gray-400">{logo.name}</span>
      )}
    </motion.div>
  );
}

// Mock Data for Pricing
const pricingPlans = [
  {
    name: "Starter",
    price: "99",
    description: "Perfect for growing startups.",
    features: [
      "5 AI Agents",
      "1,000 Conversations/mo",
      "Email Support",
      "Basic Analytics",
      "7-day History"
    ]
  },
  {
    name: "Professional",
    price: "299",
    popular: true,
    description: "For scaling teams requiring power.",
    features: [
      "20 AI Agents",
      "10,000 Conversations/mo",
      "Priority 24/7 Support",
      "Advanced Analytics",
      "Unlimited History",
      "Custom Training"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Unlimited power for global brands.",
    features: [
      "Unlimited Agents",
      "Unlimited Conversations",
      "Dedicated Success Manager",
      "SSO & SLA",
      "On-premise Deployment",
      "Custom API Access"
    ]
  }
];

export default function Home() {
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 12]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isYearly, setIsYearly] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Slower rotation for readability
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-x-hidden cursor-none">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-8 h-8 border border-primary-500 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[100] hidden md:block"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: "spring", stiffness: 700, damping: 28 }}
      />

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SplineHero />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/80 via-transparent to-[#050507] z-10" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] z-20" />
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{ 
          backgroundColor: `rgba(5, 5, 7, ${navOpacity.get()})`,
          backdropFilter: `blur(${navBlur.get()}px)` 
        }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-transparent"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-glow-sm">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus<span className="text-primary-400">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
            </Link>
            <Link 
              href="/register"
              className="px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-30 pt-40 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-sm text-primary-300 mb-8 backdrop-blur-md hover:bg-white/[0.08] transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            NexusAI 2.0 is now live
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
              Customer Support,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400 animate-shimmer bg-[length:200%_100%]">
              Reimagined by AI.
            </span>
        </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Deploy intelligent AI agents that understand your business, resolve tickets instantly, and scale your support operations effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="relative px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-lg transition-all shadow-glow-lg hover:shadow-glow-xl hover:scale-105 flex items-center gap-2 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link 
              href="/demo"
              className="px-8 py-4 bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] rounded-full font-semibold text-lg transition-all backdrop-blur-md hover:border-white/20"
            >
              View Live Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="relative z-30 py-16 text-center border-y border-white/[0.05] bg-white/[0.01]">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mb-12">Trusted by industry leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-16 max-w-6xl mx-auto px-6">
          {logos.map((logo, index) => (
            <LogoItem key={index} logo={logo} index={index} />
          ))}
        </div>
      </section>

      {/* Before & After Comparison */}
      <section className="relative z-30 py-32 px-6 bg-[#0A0A0E]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">The NexusAI Advantage</h2>
            <p className="text-gray-400 text-lg">See the difference intelligent automation makes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Before Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm group hover:bg-red-500/10 transition-colors"
            >
              <div className="absolute -top-4 -left-4 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg">
                BEFORE
              </div>
              <div className="space-y-6 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center text-red-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">24h Response Time</h3>
                    <p className="text-gray-400">Customers waiting days for simple answers.</p>
                  </div>
                </div>
                <div className="h-px bg-red-500/20" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center text-red-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">English Only</h3>
                    <p className="text-gray-400">Limited support for global customers.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* After Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl border border-primary-500/30 bg-primary-500/10 backdrop-blur-md shadow-glow-lg group hover:bg-primary-500/20 transition-colors"
            >
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl shadow-lg">
                WITH NEXUS AI
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Instant Answers</h3>
                    <p className="text-gray-300">Real-time responses, 24/7, in seconds.</p>
                  </div>
                </div>
                <div className="h-px bg-primary-500/20" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">100+ Languages</h3>
                    <p className="text-gray-300">Fluent support for everyone, everywhere.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Features */}
      <section className="relative z-30 py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {[
            {
              step: "01",
              title: "Connect Your Knowledge",
              desc: "Simply upload your PDFs, Notion docs, or website URL. NexusAI digests everything in seconds.",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
              align: "left"
            },
            {
              step: "02",
              title: "Customize Your Agent",
              desc: "Set the tone, voice, and strictness. Make it sound exactly like your brand.",
              image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
              align: "right"
            },
            {
              step: "03",
              title: "Deploy Anywhere",
              desc: "One-click embed for your site. Or connect to Slack, Discord, and Email.",
              image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80",
              align: "left"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(
                "flex flex-col lg:flex-row items-center gap-16",
                item.align === "right" ? "lg:flex-row-reverse" : ""
              )}
            >
              <div className="flex-1 space-y-6">
                <span className="text-primary-500 font-mono text-xl font-bold tracking-wider">STEP {item.step}</span>
                <h2 className="text-4xl font-bold text-white">{item.title}</h2>
                <p className="text-xl text-gray-400 leading-relaxed">{item.desc}</p>
                <ul className="space-y-3 mt-4">
                  {[1, 2, 3].map((_, k) => (
                    <li key={k} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                      <span>Smart feature point {k + 1} for better context</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Luxury Testimonials Carousel */}
      <section className="relative z-30 py-32 px-6 bg-[#0A0A0E] border-y border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Loved by innovative teams</h2>
            <p className="text-gray-400 text-lg">See what enterprise leaders are saying about NexusAI.</p>
          </div>
          
          <div className="relative h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: 10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute max-w-4xl w-full p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.1] backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center group hover:border-primary-500/30 transition-colors"
              >
                {/* Big Quote Icon */}
                <Quote className="w-16 h-16 text-primary-500/20 absolute top-10 left-10 transform -scale-x-100" />
                
                <div className="flex justify-center mb-8 gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-6 h-6 text-yellow-500 fill-yellow-500 drop-shadow-glow" />
                  ))}
                </div>
                
                <blockquote className="text-2xl md:text-4xl font-medium text-white mb-12 leading-tight tracking-tight">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].author} 
                      className="w-16 h-16 rounded-full border-2 border-primary-500 object-cover shadow-lg"
                    />
                    <div className="text-left">
                      <div className="font-bold text-white text-lg">{testimonials[activeTestimonial].author}</div>
                      <div className="text-primary-400">{testimonials[activeTestimonial].role}</div>
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-white/[0.1] hidden md:block" />
                  
                  <img 
                    src={testimonials[activeTestimonial].companyLogo} 
                    alt="Company Logo" 
                    className="h-8 w-auto object-contain brightness-0 invert opacity-80"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button 
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 lg:-left-20 p-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] backdrop-blur-md transition-all hover:scale-110 group"
            >
              <ChevronLeft className="w-8 h-8 text-gray-400 group-hover:text-white" />
            </button>
            <button 
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 lg:-right-20 p-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] backdrop-blur-md transition-all hover:scale-110 group"
            >
              <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-white" />
            </button>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeTestimonial === index ? "w-8 bg-primary-500" : "w-2 bg-white/[0.2] hover:bg-white/[0.4]"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-30 py-32 px-6 bg-gradient-to-b from-[#050507] to-[#0A0A0E] border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-400 mb-8">Choose the perfect plan for your business needs.</p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-white" : "text-gray-500")}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-8 bg-white/[0.1] rounded-full p-1 transition-colors hover:bg-white/[0.15]"
              >
                <motion.div 
                  animate={{ x: isYearly ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-primary-500 rounded-full shadow-glow-sm"
                />
              </button>
              <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-white" : "text-gray-500")}>
                Yearly <span className="text-primary-400 text-xs ml-1 font-bold">-20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative p-8 rounded-[2.5rem] border flex flex-col h-full transition-all duration-300",
                  plan.popular 
                    ? "bg-white/[0.03] border-primary-500/50 shadow-glow-md scale-105 z-10" 
                    : "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.02]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price === "Custom" ? "Custom" : `$${isYearly ? Number(plan.price) * 0.8 * 12 : plan.price}`}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500">/{isYearly ? "yr" : "mo"}</span>
                  )}
                </div>

                <div className="flex-1 mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-primary-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={cn(
                  "w-full py-4 rounded-xl font-bold transition-all",
                  plan.popular 
                    ? "bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-lg" 
                    : "bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.05]"
                )}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-30 py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 to-transparent opacity-50 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto p-16 rounded-[3rem] bg-white/[0.02] border border-white/[0.1] backdrop-blur-xl overflow-hidden group"
        >
          {/* Glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/20 blur-[120px] -z-10 group-hover:bg-primary-500/30 transition-colors duration-700" />
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">Ready to transform your support?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of companies delivering exceptional support experiences with NexusAI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
            href="/register"
              className="px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-200 transition-all shadow-lg shadow-white/20 hover:scale-105"
            >
              Get Started Now
            </Link>
            <div className="flex items-center gap-2 text-gray-400 px-6 py-4 border border-white/[0.1] rounded-full bg-black/20 backdrop-blur-md">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 py-16 px-6 bg-[#050507] border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow-sm">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">NexusAI</span>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            © 2025 NexusAI Inc. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
      </footer>
    </main>
  );
}
