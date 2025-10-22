import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import DarkVeil from '../../DarkVeil/DarkVeil';
import { PaymentContext } from '../../Context/PaymentProvider.jsx';
import { 
  Check, Crown, Zap, Shield, Sparkles, 
  Users, BarChart3, Headphones, Globe 
} from 'lucide-react';

function Upgrade() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { paymentData, setPaymentData } = useContext(PaymentContext);

  const plans = [
    {
      name: 'Free',
      subName: 'For everyday individuals',
      prices: { monthly: 0, yearly: 0 },
      features: [
        'Standard model access',
        'Up to 10 file uploads per day',
        'Standard processing speed',
        'Community support'
      ],
      recommended: false,
      icon: Shield,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-500/10 to-slate-500/10',
      borderColor: 'border-gray-500/20'
    },
    {
      name: 'Pro',
      subName: 'For power users & creators',
      prices: { monthly: 20, yearly: 200 },
      features: [
        'Advanced model access (GPT-5 & Gemini)',
        'Unlimited file uploads',
        'Priority processing speed',
        'Enhanced Memory features',
        'Priority email support'
      ],
      recommended: true,
      icon: Crown,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'from-violet-500/10 to-purple-500/10',
      borderColor: 'border-violet-500/20'
    },
    {
      name: 'ProPlus',
      subName: 'For professionals & teams',
      prices: { monthly: 50, yearly: 500 },
      features: [
        'All Pro features, plus:',
        'Cutting-edge multimodal models',
        'Custom integrations & API access',
        'Advanced data analysis tools',
        '24/7 dedicated support'
      ],
      recommended: false,
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-500/10 to-rose-500/10',
      borderColor: 'border-pink-500/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handlePlanSelect = (planName) => {
    setPaymentData(prev => ({ ...prev, planName }));
  };

  return (
    <div className="relative w-full min-h-screen text-white font-sans bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DarkVeil className="absolute inset-0 w-full h-full z-0" />
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20 z-[1]" />

      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 p-4">
        {/* Header and Billing Cycle Toggle */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className=" text-white/70 mb-6">
            Unlock your full potential with our advanced AI tools.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center space-x-4 mb-5"
          >
            <span className={`transition-colors font-medium ${
              billingCycle === 'monthly' ? 'text-white' : 'text-white/50'
            }`}>
              Monthly
            </span>

            <div
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-white/20 rounded-full p-1 cursor-pointer backdrop-blur-sm border border-white/10"
            >
              <motion.div
                className="w-5 h-5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
              />
            </div>

            <div className="flex flex-col items-start">
              <span className={`transition-colors font-medium ${
                billingCycle === 'yearly' ? 'text-white' : 'text-white/50'
              }`}>
                Yearly
              </span>
              <span className="text-xs text-violet-300 font-medium">Save 17%</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards (scrollable) */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-7 max-w-6xl w-full
                     max-h-[calc(100vh-18rem)]  scrollbar-thin
                     scrollbar-thumb-white/20 scrollbar-track-transparent"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map(plan => {
            const isSelected = paymentData.planName === plan.name;
            const PlanIcon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                onClick={() => handlePlanSelect(plan.name)}
                className={`group  relative backdrop-blur-xl rounded-2xl border cursor-pointer transition-all duration-300 ease-in-out ${
                  isSelected
                    ? `border-violet-400/50 shadow-2xl shadow-violet-500/20 scale-100 bg-gradient-to-b ${plan.bgColor}`
                    : `${plan.borderColor} hover:border-white/30 hover:-translate-y-2 bg-white/5`
                } ${plan.recommended && !isSelected ? 'transform lg:scale-105' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                        <PlanIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h2 className={`text-2xl font-semibold mb-1 ${
                      plan.recommended ? 'text-violet-300' : 'text-white'
                    }`}>
                      {plan.name}
                    </h2>
                    <p className="text-white/60 text-sm">{plan.subName}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">${plan.prices[billingCycle]}</span>
                      <span className="text-white/60 ml-1">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-violet-300 mt-1">
                        Save ${(plan.prices.monthly * 12) - plan.prices.yearly} per year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 text-white/80 text-sm mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                    } hover:scale-105`}
                  >
                    {isSelected ? 'Current Plan' : `Choose ${plan.name}`}
                  </button>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>

       
      </div>
    </div>
  );
}

export default Upgrade;


