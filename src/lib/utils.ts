import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SERVICES = [
  {
    id: 'website',
    title: 'Création de Sites Web',
    description: 'Sites vitrines, e-commerce, portfolios — des designs modernes qui convertissent.',
    icon: '🌐',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'software',
    title: 'Logiciels & Applications',
    description: 'Développement sur mesure d\'applications web et mobiles performantes.',
    icon: '📱',
    color: 'from-violet-500 to-purple-400',
  },
  {
    id: 'hosting',
    title: 'Hébergement & Gestion',
    description: 'Hébergement sécurisé, maintenance et support technique continu.',
    icon: '☁️',
    color: 'from-sky-500 to-blue-400',
  },
  {
    id: 'ads',
    title: 'Publicité en Ligne',
    description: 'Campagnes Google Ads, Meta Ads ciblées pour maximiser votre ROI.',
    icon: '📣',
    color: 'from-orange-500 to-amber-400',
  },
  {
    id: 'seo',
    title: 'Visibilité Google',
    description: 'Stratégie SEO complète pour dominer les résultats de recherche.',
    icon: '🔍',
    color: 'from-green-500 to-emerald-400',
  },
  {
    id: 'branding',
    title: 'Logo & Identité de Marque',
    description: 'Création d\'identités visuelles mémorables qui démarquent votre entreprise.',
    icon: '✨',
    color: 'from-pink-500 to-rose-400',
  },
  {
    id: 'content',
    title: 'Création de Contenus',
    description: 'Visuels, graphismes, motion design pour une communication impactante.',
    icon: '🎨',
    color: 'from-fuchsia-500 to-pink-400',
  },
]

export const COLOR_PRESETS = [
  { name: 'Indigo', hue: 245, label: 'Indigo (défaut)' },
  { name: 'Blue', hue: 220, label: 'Bleu royal' },
  { name: 'Violet', hue: 270, label: 'Violet' },
  { name: 'Rose', hue: 340, label: 'Rose' },
  { name: 'Emerald', hue: 160, label: 'Émeraude' },
  { name: 'Orange', hue: 25, label: 'Orange' },
  { name: 'Cyan', hue: 195, label: 'Cyan' },
]

export const PROJECT_STATUSES = {
  not_started: { label: 'Non commencé', color: 'bg-gray-500', text: 'text-gray-400' },
  in_progress: { label: 'En cours', color: 'bg-blue-500', text: 'text-blue-400' },
  review: { label: 'En révision', color: 'bg-amber-500', text: 'text-amber-400' },
  completed: { label: 'Terminé', color: 'bg-green-500', text: 'text-green-400' },
}

export const QUOTE_STATUSES = {
  pending: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  reviewed: { label: 'Examiné', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  accepted: { label: 'Accepté', color: 'text-green-400', bg: 'bg-green-400/10' },
  rejected: { label: 'Refusé', color: 'text-red-400', bg: 'bg-red-400/10' },
}
