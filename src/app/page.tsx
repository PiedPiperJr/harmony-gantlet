import Link from 'next/link';
import { HandPlatter, Volume2, Settings } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Sign to Text',
      description: 'Translate sign language gestures to text in real-time.',
      icon: <HandPlatter className="w-12 h-12 text-primary" />,
      href: '/sign-to-text'
    },
    {
      title: 'Sign to audio',
      description: 'Convert text into sign sound.',
      icon: <Volume2 className="w-12 h-12 text-primary" />,
      href: '/sign-to-audio'
    },
    {
      title: 'Customize Settings',
      description: 'Adjust translation speed and preferences.',
      icon: <Settings className="w-12 h-12 text-primary" />,
      href: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-8 text-secondary-dark">
          Harmony Sign Translator
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Bridge communication gaps with real-time sign language translation.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link 
              key={feature.title} 
              href={feature.href}
              className="bg-white p-6 rounded-lg shadow-custom hover:shadow-lg transition transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h2 className="mt-4 text-xl font-semibold text-secondary-dark">
                  {feature.title}
                </h2>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}