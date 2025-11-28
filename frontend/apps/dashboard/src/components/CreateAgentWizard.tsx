'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Building2,
  Bot,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Mail,
  Phone,
  Clock
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

interface CreateAgentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AgentConfig) => Promise<void>;
}

export interface AgentConfig {
  // Basic
  domainUrl: string;
  
  // Business Info
  companyName: string;
  industry: string;
  companyDescription: string;
  
  // Agent Config
  agentName: string;
  agentPersonality: 'professional' | 'friendly' | 'casual';
  primaryLanguage: string;
  
  // Business Details
  productsServices: string;
  targetAudience: string;
  keyFeatures: string;
  
  // FAQ
  faqs: Array<{ question: string; answer: string }>;
  additionalInfo: string;
  
  // Contact
  supportEmail: string;
  supportPhone: string;
  workingHours: string;
}

const PERSONALITY_OPTIONS = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-oriented',
    icon: '👔'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and approachable',
    icon: '😊'
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and conversational',
    icon: '😎'
  }
];

export function CreateAgentWizard({ isOpen, onClose, onSubmit }: CreateAgentWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AgentConfig>({
    domainUrl: '',
    companyName: '',
    industry: '',
    companyDescription: '',
    agentName: 'Support Agent',
    agentPersonality: 'friendly',
    primaryLanguage: 'en',
    productsServices: '',
    targetAudience: '',
    keyFeatures: '',
    faqs: [{ question: '', answer: '' }],
    additionalInfo: '',
    supportEmail: '',
    supportPhone: '',
    workingHours: 'Monday-Friday, 9AM-5PM'
  });

  const totalSteps = 5;

  const updateField = (field: keyof AgentConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setStep(1);
      setFormData({
        domainUrl: '',
        companyName: '',
        industry: '',
        companyDescription: '',
        agentName: 'Support Agent',
        agentPersonality: 'friendly',
        primaryLanguage: 'en',
        productsServices: '',
        targetAudience: '',
        keyFeatures: '',
        faqs: [{ question: '', answer: '' }],
        additionalInfo: '',
        supportEmail: '',
        supportPhone: '',
        workingHours: 'Monday-Friday, 9AM-5PM'
      });
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Basic Information
              </h3>
              <p className="text-gray-400">
                Let's start with your website and company details
              </p>
            </div>

            <Input
              label="Website URL"
              placeholder="www.yourcompany.com"
              value={formData.domainUrl}
              onChange={(e) => updateField('domainUrl', e.target.value)}
              fullWidth
            />

            <Input
              label="Company Name"
              placeholder="Acme Inc."
              value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              fullWidth
            />

            <Input
              label="Industry"
              placeholder="E-commerce, SaaS, Healthcare, etc."
              value={formData.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              fullWidth
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                About Your Business
              </h3>
              <p className="text-gray-400">
                Help the AI understand what your company does
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Description
              </label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => updateField('companyDescription', e.target.value)}
                placeholder="Tell us about your company, what you do, and your mission..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary-500/50 focus:bg-white/[0.05] text-white placeholder-gray-600 min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Products/Services
              </label>
              <textarea
                value={formData.productsServices}
                onChange={(e) => updateField('productsServices', e.target.value)}
                placeholder="List your main products or services..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary-500/50 focus:bg-white/[0.05] text-white placeholder-gray-600 min-h-[100px]"
              />
            </div>

            <Input
              label="Target Audience"
              placeholder="Small businesses, Enterprises, Consumers, etc."
              value={formData.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              fullWidth
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Agent Personality
              </h3>
              <p className="text-gray-400">
                Choose how your AI agent should communicate
              </p>
            </div>

            <Input
              label="Agent Name"
              placeholder="Support Agent, Sales Bot, Helper, etc."
              value={formData.agentName}
              onChange={(e) => updateField('agentName', e.target.value)}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Communication Style
              </label>
              <div className="grid grid-cols-3 gap-4">
                {PERSONALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateField('agentPersonality', option.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-center',
                      formData.agentPersonality === option.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1]'
                    )}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-white mb-1">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Knowledge Base & FAQs
              </h3>
              <p className="text-gray-400">
                Train your agent with common questions and answers
              </p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">
                      FAQ #{index + 1}
                    </span>
                    {formData.faqs.length > 1 && (
                      <button
                        onClick={() => removeFaq(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Question?"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    fullWidth
                  />
                  <textarea
                    placeholder="Answer..."
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary-500/50 text-white placeholder-gray-600 min-h-[80px]"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addFaq}
              className="w-full py-3 rounded-xl border-2 border-dashed border-white/[0.1] hover:border-primary-500/50 text-gray-400 hover:text-primary-400 transition-colors"
            >
              + Add Another FAQ
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Contact & Support
              </h3>
              <p className="text-gray-400">
                How can customers reach you?
              </p>
            </div>

            <Input
              label="Support Email"
              type="email"
              placeholder="support@yourcompany.com"
              value={formData.supportEmail}
              onChange={(e) => updateField('supportEmail', e.target.value)}
              startIcon={<Mail className="w-5 h-5" />}
              fullWidth
            />

            <Input
              label="Support Phone (Optional)"
              placeholder="+1 (555) 123-4567"
              value={formData.supportPhone}
              onChange={(e) => updateField('supportPhone', e.target.value)}
              startIcon={<Phone className="w-5 h-5" />}
              fullWidth
            />

            <Input
              label="Working Hours"
              placeholder="Monday-Friday, 9AM-5PM EST"
              value={formData.workingHours}
              onChange={(e) => updateField('workingHours', e.target.value)}
              startIcon={<Clock className="w-5 h-5" />}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => updateField('additionalInfo', e.target.value)}
                placeholder="Any other information the AI should know..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary-500/50 text-white placeholder-gray-600 min-h-[100px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="2xl"
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary-400">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
          {step > 1 ? (
            <Button
              onClick={prevStep}
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              onClick={nextStep}
              variant="primary"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="primary"
              isLoading={isSubmitting}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

