import { Target, Users, Award } from 'lucide-react';

export function Mission() {
  return (
    <section id="mission" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to advancing cancer care through innovative treatment, 
            groundbreaking research, and compassionate support for every patient.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="mb-3">Advanced Treatment</h3>
            <p className="text-gray-600">
              State-of-the-art medical technology and personalized treatment plans for every patient.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="mb-3">Patient Support</h3>
            <p className="text-gray-600">
              Comprehensive care programs including counseling, nutrition, and family support services.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="mb-3">Research Excellence</h3>
            <p className="text-gray-600">
              Leading clinical trials and research initiatives to discover tomorrow's cancer treatments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}