import React from 'react';
import { Activity, ShieldCheck, Award, Heart, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-full">
          <Activity className="h-4 w-4" /> About HealthTrack
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Patients with End-to-End Digital Healthcare
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          HealthTrack is an academic Full Stack Development (FSD) platform designed to streamline diagnostic bookings, doctor appointments, patient journey tracking, and certified report delivery.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl w-fit">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Our Mission</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            To provide a unified, accessible, and transparent digital healthcare ecosystem where patients control their medical reports and consultations effortlessly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Secure Architecture</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Built using Node.js, Express, MongoDB, and React with JWT authentication and strict role-based access control for Patients, Doctors, and Administrators.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Academic Project Excellence</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Demonstrating full-stack CRUD capabilities, mock payment integration, dynamic timeline rendering, and automated PDF report generation.
          </p>
        </div>
      </div>
    </div>
  );
}
